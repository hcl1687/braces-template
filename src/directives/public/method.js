import { textContent, warn, replace, createAnchor } from '../../util/index'
import { METHOD } from '../priorities'

function noop () {}

export default {

  priority: METHOD,
  terminal: true,
  scopeVar: '__braces__',

  bind () {
    this.args = this.arg.split(',')
    this.body = textContent(this.el)
    this.anchor = createAnchor('v-method')
    var el = this.el
    replace(el, this.anchor)
  },

  update (value) {
    if (this.vm[value]) {
      if (process.env.NODE_ENV !== 'production') {
        /* istanbul ignore if */
        warn(
          'Property: ' + value +
          ' is already defined.'
        )
      }

      return
    }

    if (this.args.indexOf(this.scopeVar) > -1) {
      if (process.env.NODE_ENV !== 'production') {
        /* istanbul ignore if */
        warn(
          'Do not use ' + this.scopeVar + ' as a function parameter.'
        )
      }

      return
    }

    var argsName = [this.scopeVar].concat(this.args)
    var fun = this.create(argsName, this.body)
    var scope = this.scope
      ? typeof this.scope === 'function'
        ? this.scope.apply(this.vm)
        : this.scope
      : this.vm
    this.vm[value] = function () {
      var args = [].slice.call(arguments)
      args.unshift(scope)
      return fun.apply(scope, args)
    }
  },

  create (args, body) {
    try {
      /* eslint-disable no-new-func */
      return new Function(args.join(','), ' ' + body + ';')
      /* eslint-enable no-new-func */
    } catch (e) {
      if (process.env.NODE_ENV !== 'production') {
        /* istanbul ignore if */
        warn(
          'Invalid function. ' +
          'Generated function body: ' + body
        )
      }
      return noop
    }
  },

  unbind () {
    var name = this.value
    delete this.vm[name]
  }
}
