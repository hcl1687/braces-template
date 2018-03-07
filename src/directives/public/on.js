import { on, off, warn, isIE8 } from '../../util/index'
import { ON } from '../priorities'

// keyCode aliases
const keyCodes = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  'delete': [8, 46],
  up: 38,
  left: 37,
  right: 39,
  down: 40
}

function keyFilter (handler, keys) {
  var codes = keys.map(function (key) {
    var charCode = key.charCodeAt(0)
    if (charCode > 47 && charCode < 58) {
      return parseInt(key, 10)
    }
    if (key.length === 1) {
      charCode = key.toUpperCase().charCodeAt(0)
      if (charCode > 64 && charCode < 91) {
        return charCode
      }
    }
    return keyCodes[key]
  })
  codes = [].concat.apply([], codes)
  return function keyHandler (e) {
    if (codes.indexOf(e.keyCode) > -1) {
      return handler.call(this, e)
    }
  }
}

function stopFilter (handler) {
  return function stopHandler (e) {
    if (e.stopPropagation) {
      e.stopPropagation()
    } else {
      e.cancelBubble = true
    }
    return handler.call(this, e)
  }
}

function preventFilter (handler) {
  return function preventHandler (e) {
    if (e.preventDefault) {
      e.preventDefault()
    } else {
      e.returnValue = false
    }
    return handler.call(this, e)
  }
}

function selfFilter (handler, el) {
  return function selfHandler (e) {
    var target = e.target || e.srcElement
    var currentTarget = e.currentTarget || el
    if (target === currentTarget) {
      return handler.call(this, e)
    }
  }
}

export default {

  priority: ON,
  acceptStatement: true,
  keyCodes,

  bind () {
    // deal with iframes
    if (
      this.el.tagName === 'IFRAME' &&
      this.arg !== 'load'
    ) {
      var self = this
      var oldHandler = this.handler
      this.handler = function (e) {
        oldHandler.call(self, e)
      }
      this.iframeBind = function () {
        // on support iframe bind in ie8
        if (isIE8) {
          process.env.NODE_ENV !== 'production' && warn(
            'v-on:' + this.arg + '="' +
            this.expression + '" no support iframe bind in ie8 ',
            this.vm
          )
          return
        }
        on(
          self.el.contentWindow,
          self.arg,
          self.handler,
          self.modifiers.capture
        )
      }
      this.on('load', this.iframeBind)
    }
  },

  update (handler) {
    // stub a noop for v-on with no value,
    // e.g. @mousedown.prevent
    if (!this.descriptor.raw) {
      handler = function _handler () {}
    }

    if (typeof handler !== 'function') {
      process.env.NODE_ENV !== 'production' && warn(
        'v-on:' + this.arg + '="' +
        this.expression + '" expects a function value, ' +
        'got ' + handler,
        this.vm
      )
      return
    }

    // apply modifiers
    if (this.modifiers.stop) {
      handler = stopFilter(handler)
    }
    if (this.modifiers.prevent) {
      handler = preventFilter(handler)
    }
    if (this.modifiers.self) {
      handler = selfFilter(handler, this.el)
    }
    // key filter
    var keys = Object.keys(this.modifiers)
      .filter(function (key) {
        return key !== 'stop' &&
          key !== 'prevent' &&
          key !== 'self' &&
          key !== 'capture'
      })
    if (keys.length) {
      handler = keyFilter(handler, keys)
    }

    this.reset()
    this.handler = handler

    if (this.iframeBind) {
      this.iframeBind()
    } else {
      if (isIE8 && this.modifiers.capture) {
        // no support capture mode in ie8
        process.env.NODE_ENV !== 'production' && warn(
          'v-on:' + this.arg + '="' +
          this.expression + '" no support capture mode in ie8 ',
          this.vm
        )
      }
      on(
        this.el,
        this.arg,
        this.handler,
        this.modifiers.capture
      )
    }
  },

  reset () {
    var el = this.iframeBind
      ? this.el.contentWindow
      : this.el
    if (this.handler) {
      off(el, this.arg, this.handler)
    }
  },

  unbind () {
    this.reset()
  }
}
