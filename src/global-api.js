import config from './config'
import directives from './directives/public/index'
import * as util from './util/index'
import * as compiler from './compiler/index'
import * as path from './parsers/path'
import * as text from './parsers/text'
import * as template from './parsers/template'
import * as directive from './parsers/directive'
import * as expression from './parsers/expression'
import FragmentFactory from './fragment/factory'

import {
  nextTick,
  mergeOptions,
  classify,
  commonTagRE,
  reservedTagRE,
  warn,
  isPlainObject
} from './util/index'

export default function (Vue) {
  /**
   * Vue and every constructor that extends Vue has an
   * associated options object, which can be accessed during
   * compilation steps as `this.constructor.options`.
   *
   * These can be seen as the default options of every
   * Vue instance.
   */

  Vue.options = {
    directives,
    replace: true
  }

  /**
   * Expose useful internals
   */

  Vue.util = util
  Vue.config = config
  Vue.nextTick = nextTick

  /**
   * The following are exposed for advanced usage / plugins
   */

  Vue.compiler = compiler
  Vue.FragmentFactory = FragmentFactory
  Vue.parsers = {
    path,
    text,
    template,
    directive,
    expression
  }

  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */

  Vue.cid = 0
  var cid = 1

  /**
   * Create asset registration methods with the following
   * signature:
   *
   * @param {String} id
   * @param {*} definition
   */

  config._assetTypes.forEach(function (type) {
    Vue[type] = function (id, definition) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        /* istanbul ignore if */
        if (process.env.NODE_ENV !== 'production') {
          if (
            type === 'component' &&
            (commonTagRE.test(id) || reservedTagRE.test(id))
          ) {
            warn(
              'Do not use built-in or reserved HTML elements as component ' +
              'id: ' + id
            )
          }
        }
        if (
          type === 'component' &&
          isPlainObject(definition)
        ) {
          if (!definition.name) {
            definition.name = id
          }
          definition = Vue.extend(definition)
        }
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
