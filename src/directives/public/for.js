import FragmentFactory from '../../fragment/factory'
import { FOR } from '../priorities'
import { getPath } from '../../parsers/path'
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

  params: [
    'track-by',
    'stagger',
    'enter-stagger',
    'leave-stagger'
  ],

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

    // uid as a cache identifier
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

    // cache
    this.cache = Object.create(null)

    // fragment factory
    this.factory = new FragmentFactory(this.vm, this.el)
  },

  update (data) {
    this.diff(data)
  },

  /**
   * Diff, based on new data and old data, determine the
   * minimum amount of DOM manipulations needed to make the
   * DOM reflect the new data Array.
   *
   * The algorithm diffs the new data Array by storing a
   * hidden reference to an owner vm instance on previously
   * seen data. This allows us to achieve O(n) which is
   * better than a levenshtein distance based algorithm,
   * which is O(m * n).
   *
   * @param {Array} data
   */

  diff (data) {
    // check if the Array was converted from an Object
    var item = data[0]
    var convertedFromObject = this.fromObject =
      isObject(item) &&
      hasOwn(item, '$key') &&
      hasOwn(item, '$value')

    var trackByKey = this.params.trackBy
    var oldFrags = this.frags
    var frags = this.frags = new Array(data.length)
    var alias = this.alias
    var iterator = this.iterator
    var start = this.start
    var end = this.end
    var init = !oldFrags
    var i, l, frag, key, value, primitive

    // First pass, go through the new Array and fill up
    // the new frags array. If a piece of data has a cached
    // instance for it, we reuse it. Otherwise build a new
    // instance.
    for (i = 0, l = data.length; i < l; i++) {
      item = data[i]
      key = convertedFromObject ? item.$key : null
      value = convertedFromObject ? item.$value : item
      primitive = !isObject(value)
      frag = !init && this.getCachedFrag(value, i, key)
      if (frag) { // reusable fragment
        frag.reused = true
        // update $index
        frag.scope.$index = i
        // update $key
        if (key) {
          frag.scope.$key = key
        }
        // update iterator
        if (iterator) {
          frag.scope[iterator] = key !== null ? key : i
        }
        // update data for track-by, object repeat &
        // primitive values.
        if (trackByKey || convertedFromObject || primitive) {
          frag.scope[alias] = value
        }
      } else { // new isntance
        frag = this.create(value, alias, i, key)
        frag.fresh = !init
      }
      frags[i] = frag
      if (init) {
        frag.before(end)
      }
    }

    // we're done for the initial render.
    if (init) {
      return
    }

    // Second pass, go through the old fragments and
    // destroy those who are not reused (and remove them
    // from cache)
    this.vm._vForRemoving = true
    for (i = 0, l = oldFrags.length; i < l; i++) {
      frag = oldFrags[i]
      if (!frag.reused) {
        this.deleteCachedFrag(frag)
        this.remove(frag)
      }
    }
    this.vm._vForRemoving = false

    // Final pass, move/insert new fragments into the
    // right place.
    var targetPrev, prevEl, currentPrev
    for (i = 0, l = frags.length; i < l; i++) {
      frag = frags[i]
      // this is the frag that we should be after
      targetPrev = frags[i - 1]
      prevEl = targetPrev
        ? targetPrev.end || targetPrev.node
        : start
      if (frag.reused) {
        currentPrev = findPrevFrag(frag, start, this.id)
        if (
          currentPrev !== targetPrev && (
            !currentPrev ||
            // optimization for moving a single item.
            // thanks to suggestions by @livoras in #1807
            findPrevFrag(currentPrev, start, this.id) !== targetPrev
          )
        ) {
          this.move(frag, prevEl)
        }
      } else {
        // new instance, or still in stagger.
        // insert with updated stagger index.
        this.insert(frag, prevEl)
      }
      frag.reused = frag.fresh = false
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
    this.cacheFrag(value, frag, index, key)
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
   * Cache a fragment using track-by or the object key.
   *
   * @param {*} value
   * @param {Fragment} frag
   * @param {Number} index
   * @param {String} [key]
   */

  cacheFrag (value, frag, index, key) {
    var trackByKey = this.params.trackBy
    var cache = this.cache
    var primitive = !isObject(value)
    var id
    if (key || trackByKey || primitive) {
      id = getTrackByKey(index, key, value, trackByKey)
      if (!cache[id]) {
        cache[id] = frag
      } else if (trackByKey !== '$index') {
        process.env.NODE_ENV !== 'production' &&
        this.warnDuplicate(value)
      }
    } else {
      id = this.id
      if (hasOwn(value, id)) {
        if (value[id] === null) {
          value[id] = frag
        } else {
          process.env.NODE_ENV !== 'production' &&
          this.warnDuplicate(value)
        }
      } else if (Object.isExtensible(value)) {
        value[id] = frag
      } else if (process.env.NODE_ENV !== 'production') {
        warn(
          'Frozen v-for objects cannot be automatically tracked, make sure to ' +
          'provide a track-by key.'
        )
      }
    }
    frag.raw = value
  },

  /**
   * Get a cached fragment from the value/index/key
   *
   * @param {*} value
   * @param {Number} index
   * @param {String} key
   * @return {Fragment}
   */

  getCachedFrag (value, index, key) {
    var trackByKey = this.params.trackBy
    var primitive = !isObject(value)
    var frag
    if (key || trackByKey || primitive) {
      var id = getTrackByKey(index, key, value, trackByKey)
      frag = this.cache[id]
    } else {
      frag = value[this.id]
    }
    if (frag && (frag.reused || frag.fresh)) {
      process.env.NODE_ENV !== 'production' &&
      this.warnDuplicate(value)
    }
    return frag
  },

  /**
   * Delete a fragment from cache.
   *
   * @param {Fragment} frag
   */

  deleteCachedFrag (frag) {
    var value = frag.raw
    var trackByKey = this.params.trackBy
    var scope = frag.scope
    var index = scope.$index
    // fix #948: avoid accidentally fall through to
    // a parent repeater which happens to have $key.
    var key = hasOwn(scope, '$key') && scope.$key
    var primitive = !isObject(value)
    if (trackByKey || key || primitive) {
      var id = getTrackByKey(index, key, value, trackByKey)
      this.cache[id] = null
    } else {
      value[this.id] = null
      frag.raw = null
    }
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
        this.deleteCachedFrag(frag)
        frag.destroy()
      }
    }
  }
}

/**
 * Helper to find the previous element that is a fragment
 * anchor. This is necessary because a destroyed frag's
 * element could still be lingering in the DOM before its
 * leaving transition finishes, but its inserted flag
 * should have been set to false so we can skip them.
 *
 * If this is a block repeat, we want to make sure we only
 * return frag that is bound to this v-for. (see #929)
 *
 * @param {Fragment} frag
 * @param {Comment|Text} anchor
 * @param {String} id
 * @return {Fragment}
 */

function findPrevFrag (frag, anchor, id) {
  var el = frag.node.previousSibling
  /* istanbul ignore if */
  if (!el) return
  frag = el.__v_frag
  while (
    (!frag || frag.forId !== id || !frag.inserted) &&
    el !== anchor
  ) {
    el = el.previousSibling
    /* istanbul ignore if */
    if (!el) return
    frag = el.__v_frag
  }
  return frag
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

/**
 * Get the track by key for an item.
 *
 * @param {Number} index
 * @param {String} key
 * @param {*} value
 * @param {String} [trackByKey]
 */

function getTrackByKey (index, key, value, trackByKey) {
  return trackByKey
    ? trackByKey === '$index'
      ? index
      : trackByKey.charAt(0).match(/\w/)
        ? getPath(value, trackByKey)
        : value[trackByKey]
    : (key || value)
}

if (process.env.NODE_ENV !== 'production') {
  vFor.warnDuplicate = function (value) {
    warn(
      'Duplicate value found in v-for="' + this.descriptor.raw + '": ' +
      JSON.stringify(value) + '. Use track-by="$index" if ' +
      'you are expecting duplicate values.',
      this.vm
    )
  }
}

export default vFor
