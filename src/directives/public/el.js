import { camelize } from '../../util/index'
import { EL } from '../priorities'

export default {

  priority: EL,

  bind () {
    /* istanbul ignore if */
    if (!this.arg) {
      return
    }
    var id = this.id = camelize(this.arg)
    var refs = (this._scope || this.vm).$els
    refs[id] = this.el
  },

  unbind () {
    var refs = (this._scope || this.vm).$els
    if (refs[this.id] === this.el) {
      refs[this.id] = null
    }
  }
}
