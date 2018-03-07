import Directive from '../../directive'
import { parseTemplate } from '../../parsers/template'

import {
  getAttr,
  arrRemove,
  warn,
  isIE8,
  isTemplate
} from '../../util/index'

import {
  compile
} from '../../compiler/index'

export default function (Braces) {
  /**
   * Transclude, compile and link element.
   *
   * If a pre-compiled linker is available, that means the
   * passed in element will be pre-transcluded and compiled
   * as well - all we need to do is to call the linker.
   *
   * Otherwise we need to call transclude/compile/link here.
   *
   * @param {Element} el
   */

  Braces.prototype._compile = function (el) {
    var options = this.$options

    // transclude and init element
    // transclude can potentially replace original
    // so we need to keep reference; this step also injects
    // the template and caches the original attributes
    // on the container node and replacer node.
    this._transclude(el, options)
    this._initElement(el)

    // handle v-pre on root node (#2026)
    if (el.nodeType === 1 && getAttr(el, 'v-pre') !== null) {
      return
    }

    // link phase
    // make sure to link root with prop scope!
    var contentUnlinkFn = compile(el, options)(this, el)

    // register composite unlink function
    // to be called during instance destruction
    this._unlinkFn = function () {
      // passing destroying: true to avoid searching and
      // splicing the directives
      contentUnlinkFn(true)
    }

    this._isCompiled = true
    this._callHook('compiled')
  }

  /**
   * Process an element or a DocumentFragment based on a
   * instance option object. This allows us to transclude
   * a template node/fragment before the instance is created,
   * so the processed fragment can then be cloned and reused
   * in v-for.
   *
   * @param {Element} el
   * @param {Object} options
   * @return {Element|DocumentFragment}
   */

  Braces.prototype._transclude = function (el, options) {
    // for template tags, what we want is its content as
    // a documentFragment (for fragment instances)
    if (isTemplate(el)) {
      // el = parseTemplate(el)
      // target should not be a template
      process.env.NODE_ENV !== 'production' && warn(
        'Do not mount an instance to a <template> tag.'
      )
      return el
    }

    if (options && options.template) {
      var frag = parseTemplate(options.template, true)
      if (frag) {
        el.appendChild(frag)
      }
    }

    return el
  }

  /**
   * Initialize instance element. Called in the public
   * $mount() method.
   *
   * @param {Element} el
   */

  Braces.prototype._initElement = function (el) {
    if (isIE8) {
      var content = el.innerHTML.toLowerCase()
      // no support svg in ie8
      var svgRE = /<svg[^>]*>/
      if (svgRE.test(content)) {
        process.env.NODE_ENV !== 'production' && warn(
          'Do not use SVG tag. IE8 doesn\'t support SVG.',
          this
        )
      }
      // no support template tag in ie8
      var templateRE = /<\/template[^>]*/
      if (templateRE.test(content)) {
        process.env.NODE_ENV !== 'production' && warn(
          'IE8 cannot use `<template id="my-template">`. instead of `<script id="my-template" type="x/template">`',
          this
        )
      }
    }

    this.$el = el
    this.$el.__braces__ = this
    this._callHook('beforeCompile')
  }

  /**
   * Create and bind a directive to an element.
   *
   * @param {Object} descriptor - parsed directive descriptor
   * @param {Node} node   - target node
   * @param {Object} [scope] - v-for scope
   * @param {Fragment} [frag] - owner fragment
   */

  Braces.prototype._bindDir = function (descriptor, node, scope, frag) {
    this._directives.push(
      new Directive(descriptor, this, node, scope, frag)
    )
  }

  /**
   * Teardown an instance, unobserves the data, unbind all the
   * directives, turn off all the event listeners, etc.
   *
   * @param {Boolean} remove - whether to remove the DOM node.
   * @param {Boolean} deferCleanup - if true, defer cleanup to
   *                                 be called later
   */

  Braces.prototype._destroy = function (remove, deferCleanup) {
    if (this._isBeingDestroyed) {
      if (!deferCleanup) {
        this._cleanup()
      }
      return
    }

    var destroyReady
    var pendingRemoval

    var self = this
    // Cleanup should be called either synchronously or asynchronoysly as
    // callback of this.$remove(), or if remove and deferCleanup are false.
    // In any case it should be called after all other removing, unbinding and
    // turning of is done
    var cleanupIfPossible = function () {
      if (destroyReady && !pendingRemoval && !deferCleanup) {
        self._cleanup()
      }
    }

    // remove DOM element
    if (remove && this.$el) {
      pendingRemoval = true
      this.$remove(function () {
        pendingRemoval = false
        cleanupIfPossible()
      })
    }

    this._callHook('beforeDestroy')
    this._isBeingDestroyed = true
    // teardown all directives. this also tearsdown all
    // directive-owned watchers.
    if (this._unlinkFn) {
      this._unlinkFn()
    }
    // remove reference to self on $el
    if (this.$el) {
      this.$el.__braces__ = null
    }

    destroyReady = true
    cleanupIfPossible()
  }

  /**
   * Clean up to ensure garbage collection.
   * This is called after the leave transition if there
   * is any.
   */

  Braces.prototype._cleanup = function () {
    if (this._isDestroyed) {
      return
    }
    // remove self from owner fragment
    // do it in cleanup so that we can call $destroy with
    // defer right when a fragment is about to be removed.
    if (this._frag) {
      arrRemove(this._frag.children, this)
    }

    // Clean up references to private properties and other
    // instances. preserve reference to _data so that proxy
    // accessors still work. The only potential side effect
    // here is that mutating the instance after it's destroyed
    // may affect the state of other components that are still
    // observing the same object, but that seems to be a
    // reasonable responsibility for the user rather than
    // always throwing an error on them.
    this.$el =
    this.$parent =
    this.$root =
    this._context =
    this._scope =
    this._directives = null
    // call the last hook...
    this._isDestroyed = true
    this._callHook('destroyed')
    // turn off all instance listeners.
    this.$off()
  }
}
