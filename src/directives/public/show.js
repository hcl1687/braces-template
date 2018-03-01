import { getAttr, nextElementSibling } from '../../util/index'

export default {

  bind () {
    // check else block
    var next = nextElementSibling(this.el)
    if (next && getAttr(next, 'v-else') !== null) {
      this.elseEl = next
    }
  },

  update (value) {
    this.apply(this.el, value)
    if (this.elseEl) {
      this.apply(this.elseEl, !value)
    }
  },

  apply (el, value) {
    toggle()
    function toggle () {
      el.style.display = value ? '' : 'none'
    }
  }
}
