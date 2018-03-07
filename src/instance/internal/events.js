import {
  isArray,
  warn
} from '../../util/index'

export default function (Braces) {
  /**
   * Setup the instance's option events & watchers.
   * If the value is a string, we pull it from the
   * instance's methods by name.
   */

  Braces.prototype._initEvents = function () {
    var options = this.$options
    registerCallbacks(this, '$on', options.events)
  }

  /**
   * Register callbacks for option events and watchers.
   *
   * @param {Braces} vm
   * @param {String} action
   * @param {Object} hash
   */

  function registerCallbacks (vm, action, hash) {
    if (!hash) return
    var handlers, key, i, j
    for (key in hash) {
      handlers = hash[key]
      if (isArray(handlers)) {
        for (i = 0, j = handlers.length; i < j; i++) {
          register(vm, action, key, handlers[i])
        }
      } else {
        register(vm, action, key, handlers)
      }
    }
  }

  /**
   * Helper to register an event/watch callback.
   *
   * @param {Braces} vm
   * @param {String} action
   * @param {String} key
   * @param {Function|String|Object} handler
   */

  function register (vm, action, key, handler) {
    var type = typeof handler
    if (type === 'function') {
      vm[action](key, handler)
    } else if (type === 'string') {
      var methods = vm.$options.methods
      var method = methods && methods[handler]
      if (method) {
        vm[action](key, method)
      } else {
        process.env.NODE_ENV !== 'production' && warn(
          'Unknown method: "' + handler + '" when ' +
          'registering callback for ' + action +
          ': "' + key + '".',
          vm
        )
      }
    } else if (handler && type === 'object') {
      register(vm, action, key, handler.handler)
    }
  }

  /**
   * Setup recursive attached/detached calls
   */

  Braces.prototype._initDOMHooks = function () {
    this.$on('hook:attached', onAttached)
    this.$on('hook:detached', onDetached)
  }

  /**
   * Callback to recursively call attached hook on children
   */

  function onAttached () {
    if (!this._isAttached) {
      this._isAttached = true
    }
  }

  /**
   * Callback to recursively call detached hook on children
   */

  function onDetached () {
    if (this._isAttached) {
      this._isAttached = false
    }
  }

  /**
   * Trigger all handlers for a hook
   *
   * @param {String} hook
   */

  Braces.prototype._callHook = function (hook) {
    this.$emit('pre-hook:' + hook)
    var handlers = this.$options[hook]
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        handlers[i].call(this)
      }
    }
    this.$emit('hook:' + hook)
  }
}
