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

export default function (Braces) {
  /**
   * Braces and every constructor that extends Braces has an
   * associated options object, which can be accessed during
   * compilation steps as `this.constructor.options`.
   *
   * These can be seen as the default options of every
   * Braces instance.
   */

  Braces.options = {
    directives,
    replace: true
  }

  /**
   * Expose useful internals
   */

  Braces.util = util
  Braces.config = config
  Braces.nextTick = util.nextTick

  /**
   * The following are exposed for advanced usage / plugins
   */

  Braces.compiler = compiler
  Braces.FragmentFactory = FragmentFactory
  Braces.parsers = {
    path,
    text,
    template,
    directive,
    expression
  }

  /**
   * Each instance constructor, including Braces, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */

  Braces.cid = 0

  /**
   * Create asset registration methods with the following
   * signature:
   *
   * @param {String} id
   * @param {*} definition
   */

  config._assetTypes.forEach(function (type) {
    Braces[type] = function (id, definition) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        this.options[type + 's'][id] = definition
        return definition
      }
    }
  })
}
