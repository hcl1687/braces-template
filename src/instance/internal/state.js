import {
  warn,
  isReserved,
  isPlainObject,
  bind
} from '../../util/index'

export default function (Braces) {
  /**
   * Setup the scope of an instance, which contains:
   * - observed data
   * - computed properties
   * - user methods
   * - meta properties
   */

  Braces.prototype._initState = function () {
    this._initMethods()
    this._initData()
  }

  /**
   * Initialize the data.
   */

  Braces.prototype._initData = function () {
    var dataFn = this.$options.data
    var data = this._data = dataFn ? dataFn() : {}
    if (!isPlainObject(data)) {
      data = {}
      process.env.NODE_ENV !== 'production' && warn(
        'data functions should return an object.',
        this
      )
    }

    // proxy data on instance
    var keys = Object.keys(data)
    var i, key
    i = keys.length
    while (i--) {
      key = keys[i]
      this._proxy(key)
    }
  }

  /**
   * Proxy a property, so that
   * vm.prop === vm._data.prop
   *
   * @param {String} key
   */

  Braces.prototype._proxy = function (key) {
    if (!isReserved(key)) {
      // need to store ref to self here
      // because these getter/setters might
      // be called by child scopes via
      // prototype inheritance.
      this[key] = this._data[key]
    }
  }

  /**
   * Unproxy a property.
   *
   * @param {String} key
   */

  Braces.prototype._unproxy = function (key) {
    if (!isReserved(key)) {
      delete this[key]
    }
  }

  /**
   * Setup instance methods. Methods must be bound to the
   * instance since they might be passed down as a prop to
   * child components.
   */

  Braces.prototype._initMethods = function () {
    var methods = this.$options.methods
    if (methods) {
      for (var key in methods) {
        this[key] = bind(methods[key], this)
      }
    }
  }
}
