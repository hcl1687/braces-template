import { warn, camelize, setClass, isIE8 } from '../../util/index'
import { BIND } from '../priorities'

// xlink
const xlinkNS = 'http://www.w3.org/1999/xlink'
const xlinkRE = /^xlink:/

// check for attributes that prohibit interpolations
const disallowedInterpAttrRE = /^v-|^:|^@|^(?:is|transition|transition-mode|debounce|track-by|stagger|enter-stagger|leave-stagger)$/
// these attributes should also set their corresponding properties
// because they only affect the initial state of the element
const attrWithPropsRE = /^(?:value|checked|selected|muted)$/
// these attributes expect enumrated values of "true" or "false"
// but are not boolean attributes
const enumeratedAttrRE = /^(?:draggable|contenteditable|spellcheck)$/

export default {

  priority: BIND,

  bind () {
    var attr = this.arg
    var tag = this.el.tagName
    // handle interpolation bindings
    const descriptor = this.descriptor
    const tokens = descriptor.interp
    if (tokens) {
      // only allow binding on native attributes
      if (
        disallowedInterpAttrRE.test(attr) ||
        (attr === 'name' && (tag === 'PARTIAL' || tag === 'SLOT'))
      ) {
        process.env.NODE_ENV !== 'production' && warn(
          attr + '="' + descriptor.raw + '": ' +
          'attribute interpolation is not allowed in Vue.js ' +
          'directives and special attributes.',
          this.vm
        )
        this.el.removeAttribute(attr)
        this.invalid = true
      }

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production') {
        var raw = attr + '="' + descriptor.raw + '": '
        // warn src
        if (attr === 'src') {
          warn(
            raw + 'interpolation in "src" attribute will cause ' +
            'a 404 request. Use v-bind:src instead.',
            this.vm
          )
        }

        // warn style
        if (attr === 'style') {
          warn(
            raw + 'interpolation in "style" attribute will cause ' +
            'the attribute to be discarded in Internet Explorer. ' +
            'Use v-bind:style instead.',
            this.vm
          )
        }
      }
    }
  },

  update (value) {
    if (this.invalid) {
      return
    }
    var attr = this.arg
    this.handleSingle(attr, value)
  },

  handleSingle (attr, value) {
    const el = this.el
    const interp = this.descriptor.interp
    if (this.modifiers.camel) {
      attr = camelize(attr)
    }
    if (
      !interp &&
      attrWithPropsRE.test(attr) &&
      attr in el
    ) {
      var attrValue = attr === 'value'
        ? value == null // IE9 will set input.value to "null" for null...
          ? ''
          : value
        : value

      if (el[attr] !== attrValue) {
        el[attr] = attrValue
      }
    }

    // do not set value attribute for textarea
    if (attr === 'value' && el.tagName === 'TEXTAREA') {
      el.removeAttribute(attr)
      return
    }
    // update attribute
    if (enumeratedAttrRE.test(attr)) {
      el.setAttribute(attr, value ? 'true' : 'false')
    } else if (value != null && value !== false) {
      if (attr === 'class') {
        setClass(el, value)
      } if (xlinkRE.test(attr)) {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production') {
          // no support xlink bind in ie8
          if (isIE8) {
            warn(
              raw + ' no support xlink bind in ie8.',
              this.vm
            )
          }
        }
        el.setAttributeNS(xlinkNS, attr, value === true ? '' : value)
      } else {
        el.setAttribute(attr, value === true ? '' : value)
      }
    } else {
      el.removeAttribute(attr)
    }
  }
}
