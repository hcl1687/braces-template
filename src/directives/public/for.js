import FragmentFactory from '../../fragment/factory'
import { FOR } from '../priorities'
import {
  isObject,
  warn,
  createAnchor,
  replace,
  before,
  after,
  hasOwn,
  isArray,
  isPlainObject
} from '../../util/index'

let uid = 0

const vFor = {

  priority: FOR,
  terminal: true,

  params: [],

  bind () {
    // support "item in/of items" syntax
    var inMatch = this.expression.match(/(.*) (?:in|of) (.*)/)
    if (inMatch) {
      var itMatch = inMatch[1].match(/\((.*),(.*)\)/)
      if (itMatch) {
        this.iterator = itMatch[1].trim()
        this.alias = itMatch[2].trim()
      } else {
        this.alias = inMatch[1].trim()
      }
      this.expression = inMatch[2]
    }

    if (!this.alias) {
      process.env.NODE_ENV !== 'production' && warn(
        'Invalid v-for expression "' + this.descriptor.raw + '": ' +
        'alias is required.',
        this.vm
      )
      return
    }

    // uid
    this.id = '__v-for__' + (++uid)

    // check if this is an option list,
    // so that we know if we need to update the <select>'s
    // v-model when the option list has changed.
    // because v-model has a lower priority than v-for,
    // the v-model is not bound here yet, so we have to
    // retrive it in the actual updateModel() function.
    var tag = this.el.tagName
    this.isOption =
      (tag === 'OPTION' || tag === 'OPTGROUP') &&
      this.el.parentNode.tagName === 'SELECT'

    // setup anchor nodes
    this.start = createAnchor('v-for-start')
    this.end = createAnchor('v-for-end')
    replace(this.el, this.end)
    before(this.start, this.end)

    // fragment factory
    this.factory = new FragmentFactory(this.vm, this.el)
  },

  update (data) {
    this.diff(data)
  },

  diff (data) {
    // check if the Array was converted from an Object
    var item = data[0]
    var convertedFromObject = this.fromObject =
      isObject(item) &&
      hasOwn(item, '$key') &&
      hasOwn(item, '$value')

    var frags = this.frags = new Array(data.length)
    var alias = this.alias
    var end = this.end
    var init = true
    var i, l, frag, key, value

    // First pass, go through the new Array and fill up
    // the new frags array. If a piece of data has a cached
    // instance for it, we reuse it. Otherwise build a new
    // instance.
    for (i = 0, l = data.length; i < l; i++) {
      item = data[i]
      key = convertedFromObject ? item.$key : null
      value = convertedFromObject ? item.$value : item
      // new isntance
      frag = this.create(value, alias, i, key)
      frag.fresh = !init
      frags[i] = frag
      frag.before(end)
    }
  },

  /**
   * Create a new fragment instance.
   *
   * @param {*} value
   * @param {String} alias
   * @param {Number} index
   * @param {String} [key]
   * @return {Fragment}
   */

  create (value, alias, index, key) {
    // create iteration scope
    var parentScope = this._scope || this.vm
    var scope = Object.create(parentScope)
    scope.$els = Object.create(parentScope.$els)
    // make sure point $parent to parent scope
    scope.$parent = parentScope
    // for two-way binding on alias
    scope.$forContext = this
    // define scope properties
    // important: define the scope alias without forced conversion
    // so that frozen data structures remain non-reactive.
    scope[alias] = value
    scope['$index'] = index
    if (key) {
      scope['$key'] = key
    } else if (scope.$key) {
      // avoid accidental fallback
      scope['$key'] = null
    }
    if (this.iterator) {
      scope[this.iterator] = key !== null ? key : index
    }
    var frag = this.factory.create(scope, this._frag)
    frag.forId = this.id
    return frag
  },

  /**
   * Insert a fragment. Handles staggering.
   *
   * @param {Fragment} frag
   * @param {Number} index
   * @param {Node} prevEl
   * @param {Boolean} inDocument
   */

  insert (frag, prevEl) {
    var target = prevEl.nextSibling
    /* istanbul ignore if */
    if (!target) {
      // reset end anchor position in case the position was messed up
      // by an external drag-n-drop library.
      after(this.end, prevEl)
      target = this.end
    }
    frag.before(target)
  },

  /**
   * Remove a fragment. Handles staggering.
   *
   * @param {Fragment} frag
   * @param {Number} index
   * @param {Number} total
   * @param {Boolean} inDocument
   */

  remove (frag, index, total, inDocument) {
    frag.remove()
  },

  /**
   * Move a fragment to a new position.
   * Force no transition.
   *
   * @param {Fragment} frag
   * @param {Node} prevEl
   */

  move (frag, prevEl) {
    // fix a common issue with Sortable:
    // if prevEl doesn't have nextSibling, this means it's
    // been dragged after the end anchor. Just re-position
    // the end anchor to the end of the container.
    /* istanbul ignore if */
    if (!prevEl.nextSibling) {
      this.end.parentNode.appendChild(this.end)
    }
    frag.before(prevEl.nextSibling, false)
  },

  /**
   * Pre-process the value before piping it through the
   * filters. This is passed to and called by the watcher.
   */

  _preProcess (value) {
    // regardless of type, store the un-filtered raw value.
    this.rawValue = value
    return value
  },

  /**
   * Post-process the value after it has been piped through
   * the filters. This is passed to and called by the watcher.
   *
   * It is necessary for this to be called during the
   * watcher's dependency collection phase because we want
   * the v-for to update when the source Object is mutated.
   */

  _postProcess (value) {
    if (isArray(value)) {
      return value
    } else if (isPlainObject(value)) {
      // convert plain object to array.
      var keys = Object.keys(value)
      var i = keys.length
      var res = new Array(i)
      var key
      while (i--) {
        key = keys[i]
        res[i] = {
          $key: key,
          $value: value[key]
        }
      }
      return res
    } else {
      if (typeof value === 'number' && !isNaN(value)) {
        value = range(value)
      }
      return value || []
    }
  },

  unbind () {
    if (this.frags) {
      var i = this.frags.length
      var frag
      while (i--) {
        frag = this.frags[i]
        frag.destroy()
      }
      this.frags = []
    }
  }
}

/**
 * Create a range array from given number.
 *
 * @param {Number} n
 * @return {Array}
 */

function range (n) {
  var i = -1
  var ret = new Array(Math.floor(n))
  while (++i < n) {
    ret[i] = i
  }
  return ret
}

export default vFor
