import {
  extend,
  bind,
  on,
  off,
  getAttr,
  getBindAttr,
  camelize,
  hyphenate,
  warn,
  arrRemove
} from './util/index'
import config from './config'
import { parseExpression, isSimplePath } from './parsers/expression'

/**
 * A directive links a DOM element with a piece of data,
 * which is the result of evaluating an expression.
 * It registers a watcher with the expression and calls
 * the DOM update function when a change is triggered.
 *
 * @param {Object} descriptor
 *                 - {String} name
 *                 - {Object} def
 *                 - {String} expression
 *                 - {Object} [modifiers]
 *                 - {Boolean} literal
 *                 - {String} attr
 *                 - {String} arg
 *                 - {String} raw
 *                 - {String} [ref]
 *                 - {Array<Object>} [interp]
 *                 - {Boolean} [hasOneTime]
 * @param {Vue} vm
 * @param {Node} el
 * @param {Object} [scope] - v-for scope
 * @param {Fragment} [frag] - owner fragmen
 * @constructor
 */

export default function Directive (descriptor, vm, el, scope, frag) {
  this.vm = vm
  this.el = el
  // copy descriptor properties
  this.descriptor = descriptor
  this.name = descriptor.name
  this.expression = descriptor.expression
  this.arg = descriptor.arg
  this.modifiers = descriptor.modifiers
  this.literal = this.modifiers && this.modifiers.literal
  // private
  this._bound = false
  this._listeners = null
  // link context
  this._scope = scope
  this._frag = frag
  // store directives on node in dev mode
  if (process.env.NODE_ENV !== 'production' && this.el && this.el.nodeType !== 3) {
    this.el._vue_directives = this.el._vue_directives || []
    this.el._vue_directives.push(this)
  }
}

/**
 * Initialize the directive, mixin definition properties,
 * setup the watcher, call definition bind() and update()
 * if present.
 */

Directive.prototype._bind = function () {
  var name = this.name
  var descriptor = this.descriptor

  // remove attribute
  if (
    (name !== 'cloak' || this.vm._isCompiled) &&
    this.el && this.el.removeAttribute
  ) {
    var attr = descriptor.attr || ('v-' + name)
    this.el.removeAttribute(attr)
  }

  // copy def properties
  var def = descriptor.def
  if (typeof def === 'function') {
    this.update = def
  } else {
    extend(this, def)
  }

  // setup directive params
  this._setupParams()

  // initial bind
  if (this.bind) {
    this.bind()
  }
  this._bound = true

  if (this.literal) {
    this.update && this.update(descriptor.raw)
  } else if (
    (this.expression || this.modifiers) &&
    this.update &&
    !this._checkStatement()
  ) {
    var preProcess = this._preProcess
      ? bind(this._preProcess, this)
      : null
    var postProcess = this._postProcess
      ? bind(this._postProcess, this)
      : null

    var isFn = typeof this.expression === 'function'
    if (isFn) {
      this.getter = this.expression
      this.setter = undefined
    } else {
      var res = parseExpression(this.expression)
      this.getter = res.get
      this.setter = undefined
    }

    var scope = this._scope || this.vm
    let value
    try {
      value = this.getter.call(scope, scope)
    } catch (e) {
      if (
        process.env.NODE_ENV !== 'production' &&
        config.warnExpressionErrors
      ) {
        warn(
          'Error when evaluating expression ' +
          '"' + this.expression + '": ' + e.toString(),
          this.vm
        )
      }
    }

    if (preProcess) {
      value = preProcess.call(this, value)
    }
    if (postProcess) {
      value = postProcess.call(this, value)
    }

    // v-model with inital inline value need to sync back to
    // model instead of update to DOM on init. They would
    // set the afterBind hook to indicate that.
    if (this.afterBind) {
      this.afterBind()
    } else if (this.update) {
      this.update(value)
    }
  }
}

/**
 * Setup all param attributes, e.g. track-by,
 * transition-mode, etc...
 */

Directive.prototype._setupParams = function () {
  if (!this.params) {
    return
  }
  var params = this.params
  // swap the params array with a fresh object.
  this.params = Object.create(null)
  var i = params.length
  var key, val, mappedKey
  while (i--) {
    key = hyphenate(params[i])
    mappedKey = camelize(key)
    val = getBindAttr(this.el, key)
    if (val != null) {
      // dynamic
      var scope = this._scope || this.vm
      this.params[mappedKey] = this._getDynamicValue(scope, val)
    } else {
      // static
      val = getAttr(this.el, key)
      if (val != null) {
        this.params[mappedKey] = val === '' ? true : val
      }
    }
  }
}

/**
 * Get the value from an expression on scope.
 *
 * @param {String} key
 * @param {String} expression
 */

Directive.prototype._getDynamicValue = function (scope, expression) {
  var getter = parseExpression(expression).get

  let value
  try {
    value = getter.call(scope, scope)
  } catch (e) {
    if (
      process.env.NODE_ENV !== 'production' &&
      config.warnExpressionErrors
    ) {
      warn(
        'Error when evaluating expression ' +
        '"' + this.expression + '": ' + e.toString(),
        this.vm
      )
    }
  }

  return value
}

/**
 * Check if the directive is a function caller
 * and if the expression is a callable one. If both true,
 * we wrap up the expression and use it as the event
 * handler.
 *
 * e.g. on-click="a++"
 *
 * @return {Boolean}
 */

Directive.prototype._checkStatement = function () {
  var expression = this.expression
  if (
    expression && this.acceptStatement &&
    !isSimplePath(expression)
  ) {
    var fn = parseExpression(expression).get
    var scope = this._scope || this.vm
    var handler = function (e) {
      scope.$event = e
      fn.call(scope, scope)
      scope.$event = null
    }

    this.update(handler)
    return true
  }
}

/**
 * Convenience method that attaches a DOM event listener
 * to the directive element and autometically tears it down
 * during unbind.
 *
 * @param {String} event
 * @param {Function} handler
 * @param {Boolean} [useCapture]
 */

Directive.prototype.on = function (event, handler, useCapture) {
  on(this.el, event, handler, useCapture)
  ;(this._listeners || (this._listeners = []))
    .push([event, handler])
}

/**
 * Teardown the watcher and call unbind.
 */

Directive.prototype._teardown = function () {
  if (this._bound) {
    this._bound = false
    if (this.unbind) {
      this.unbind()
    }
    var listeners = this._listeners
    var i
    if (listeners) {
      i = listeners.length
      while (i--) {
        off(this.el, listeners[i][0], listeners[i][1])
      }
    }

    if (process.env.NODE_ENV !== 'production' && this.el && this.el.nodeType !== 3) {
      arrRemove(this.el._vue_directives, this)
    }
    this.vm = this.el = this._listeners = null
  }
}
