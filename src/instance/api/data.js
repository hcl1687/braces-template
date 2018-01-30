import { parseExpression } from '../../parsers/expression'

export default function (Vue) {
  /**
   * Get the value from an expression on this vm.
   *
   * @param {String} exp
   * @param {Boolean} [asStatement]
   * @return {*}
   */

  Vue.prototype.$get = function (exp) {
    var res = parseExpression(exp)
    if (res) {
      try {
        return res.get.call(this, this)
      } catch (e) {}
    }
  }
}
