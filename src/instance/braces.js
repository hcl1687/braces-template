import initMixin from './internal/init'
import stateMixin from './internal/state'
import eventsMixin from './internal/events'
import lifecycleMixin from './internal/lifecycle'

import dataAPI from './api/data'
import domAPI from './api/dom'
import eventsAPI from './api/events'
import lifecycleAPI from './api/lifecycle'

/**
 * The exposed Braces constructor.
 *
 * API conventions:
 * - public API methods/properties are prefixed with `$`
 * - internal methods/properties are prefixed with `_`
 * - non-prefixed properties are assumed to be proxied user
 *   data.
 *
 * @constructor
 * @param {Object} [options]
 * @public
 */

function Braces (options) {
  this._init(options)
}

// install internals
initMixin(Braces)
stateMixin(Braces)
eventsMixin(Braces)
lifecycleMixin(Braces)

// install instance APIs
dataAPI(Braces)
domAPI(Braces)
eventsAPI(Braces)
lifecycleAPI(Braces)

export default Braces
