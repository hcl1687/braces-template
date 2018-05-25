import { mergeOptions } from '../../util/index'

let uid = 0

export default function (Braces) {
  /**
   * The main init sequence. This is called for every
   * instance, including ones that are created from extended
   * constructors.
   *
   * @param {Object} options - this options object should be
   *                           the result of merging class
   *                           options and the options passed
   *                           in to the constructor.
   */

  Braces.prototype._init = function (options) {
    options = options || {}

    this.$el = null
    this.$parent = options.parent
    this.$root = this.$parent
      ? this.$parent.$root
      : this
    this.$els = {} // element references
    this._directives = [] // all directives

    // a uid
    this._uid = uid++

    // a flag to avoid this being observed
    this._isBraces = true

    // events bookkeeping
    this._events = {} // registered callbacks

    // fragment instance properties
    this._isFragment = false
    this._fragment = // @type {DocumentFragment}
    this._fragmentStart = // @type {Text|Comment}
    this._fragmentEnd = null // @type {Text|Comment}

    // v-source support async promise
    // so need to record how many v-source is pending.
    // this param is used for determine when the dom is ready
    this._vsourcePending = 0

    // lifecycle state
    this._isCompiled =
    this._isDestroyed =
    this._isReady =
    this._isAttached =
    this._isBeingDestroyed =
    this._vForRemoving = false
    this._unlinkFn = null

    // scope:
    // if this is inside an inline v-for, the scope
    // will be the intermediate scope created for this
    // repeat fragment. this is used for linking props
    // and container directives.
    this._scope = options._scope

    // fragment:
    // if this instance is compiled inside a Fragment, it
    // needs to reigster itself as a child of that fragment
    // for attach/detach to work properly.
    this._frag = options._frag
    if (this._frag) {
      this._frag.children.push(this)
    }

    // merge options.
    options = this.$options = mergeOptions(
      this.constructor.options,
      options,
      this
    )

    // initialize data as empty object.
    // it will be filled up in _initData().
    this._data = {}

    // call init hook
    this._callHook('init')

    // initialize data observation and scope inheritance.
    this._initState()

    // setup event system and option events.
    this._initEvents()

    // call created hook
    this._callHook('created')

    // if `el` option is passed, start compilation.
    if (options.el) {
      this.$mount(options.el)
    }
  }
}
