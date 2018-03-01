import { _toString, isIE8 } from '../../util/index'

export default {

  bind () {
    this.attr = this.el.nodeType === 3
      ? 'data'
      : isIE8 
        ? 'innerText'
        : 'textContent'
  },

  update (value) {
    this.el[this.attr] = _toString(value)
  }
}
