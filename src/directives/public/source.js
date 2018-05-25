import FragmentFactory from '../../fragment/factory'
import { SOURCE } from '../priorities'
import {
  warn,
  createAnchor,
  replace,
  before,
  extend
} from '../../util/index'

let uid = 0

export default {

  priority: SOURCE,
  terminal: true,
  params: ['attached', 'detached'],

  bind () {
    // uid
    this.id = '__v-source__' + (++uid)
    // count v-source directive
    this.vm._vsourcePending++

    // setup anchor nodes
    this.start = createAnchor('v-source-start')
    this.end = createAnchor('v-source-end')
    replace(this.el, this.end)
    before(this.start, this.end)

    // fragment factory
    this.factory = new FragmentFactory(this.vm, this.el)
  },

  update (source) {
    this.handleSource(source)
  },

  /**
   * handle data source and create frag
   * @param  {[type]} source [description]
   * @return {[type]}        [description]
   */

  handleSource (source) {
    var that = this
    var isFn = typeof source === 'function'
    var data = isFn ? source() : source
    if (data && data.then) {
      data.then(function (res) {
        that.vm._vsourcePending--
        that.createFrag(res)
      }).catch(function () {
        that.vm._vsourcePending--
      })
    } else {
      that.vm._vsourcePending--
      this.createFrag(data)
    }
  },

  createFrag (data) {
    this.frag = this.create(data)
    this.frag.before(this.end)
    if (typeof this.params['attached'] === 'function') {
      this.params['attached']()
    }
    // if no pending, call ready
    if (this.vm._vsourcePending === 0) {
      this.vm._callHook('attached')
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

  create (value) {
    // create iteration scope
    var parentScope = this._scope || this.vm
    var scope = Object.create(parentScope)
    scope.$els = Object.create(parentScope.$els)
    // make sure point $parent to parent scope
    scope.$parent = parentScope
    if (value && (value.hasOwnProperty('$els') || value.hasOwnProperty('$parent'))) {
      delete value['$els']
      delete value['$parent']
      if (process.env.NODE_ENV !== 'production') {
        /* istanbul ignore if */
        warn(
          '$els or $parent is keyword. ' +
          'source data should not contain these property.'
        )
      }
    }

    // define scope properties
    extend(scope, value)
    var frag = this.factory.create(scope, this._frag)
    frag.sourceId = this.id
    return frag
  },

  unbind () {
    if (this.frag) {
      this.frag.destroy()
      this.frag = null
    }
    if (typeof this.params['detached'] === 'function') {
      this.params['detached']()
    }
  }
}
