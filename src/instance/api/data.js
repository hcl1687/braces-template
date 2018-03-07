import { toArray } from '../../util/index'
import { parseExpression } from '../../parsers/expression'

export default function (Braces) {
  /**
   * Get the value from an expression on this vm.
   *
   * @param {String} exp
   * @param {Boolean} [asStatement]
   * @return {*}
   */

  Braces.prototype.$get = function (exp, asStatement) {
    var res = parseExpression(exp)
    if (res) {
      if (asStatement) {
        var self = this
        return function statementHandler () {
          self.$arguments = toArray(arguments)
          var result = res.get.call(self, self)
          self.$arguments = null
          return result
        }
      } else {
        try {
          return res.get.call(this, this)
        } catch (e) {
          // todo
        }
      }
    }
  }
}
