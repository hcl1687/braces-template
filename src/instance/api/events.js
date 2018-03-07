import { toArray } from '../../util/index'

export default function (Braces) {
  /**
   * Listen on the given `event` with `fn`.
   *
   * @param {String} event
   * @param {Function} fn
   */

  Braces.prototype.$on = function (event, fn) {
    (this._events[event] || (this._events[event] = []))
      .push(fn)
    return this
  }

  /**
   * Adds an `event` listener that will be invoked a single
   * time then automatically removed.
   *
   * @param {String} event
   * @param {Function} fn
   */

  Braces.prototype.$once = function (event, fn) {
    var self = this
    function on () {
      self.$off(event, on)
      fn.apply(this, arguments)
    }
    on.fn = fn
    this.$on(event, on)
    return this
  }

  /**
   * Remove the given callback for `event` or all
   * registered callbacks.
   *
   * @param {String} event
   * @param {Function} fn
   */

  Braces.prototype.$off = function (event, fn) {
    var cbs
    // all
    if (!arguments.length) {
      this._events = {}
      return this
    }
    // specific event
    cbs = this._events[event]
    if (!cbs) {
      return this
    }
    if (arguments.length === 1) {
      this._events[event] = null
      return this
    }
    // specific handler
    var cb
    var i = cbs.length
    while (i--) {
      cb = cbs[i]
      if (cb === fn || cb.fn === fn) {
        cbs.splice(i, 1)
        break
      }
    }
    return this
  }

  /**
   * Trigger an event on self.
   *
   * @param {String|Object} event
   * @return {Boolean} shouldPropagate
   */

  Braces.prototype.$emit = function (event) {
    var isSource = typeof event === 'string'
    event = isSource
      ? event
      : event.name
    var cbs = this._events[event]
    if (cbs) {
      var args = toArray(arguments, 1)
      for (var i = 0, l = cbs.length; i < l; i++) {
        var cb = cbs[i]
        cb.apply(this, args)
      }
    }
  }
}
