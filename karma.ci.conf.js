var assign = require('object-assign')
var base = require('./karma.base.conf.js')

module.exports = function (config) {
  config.set(assign(base, {
    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    browsers: ['PhantomJS']
  }))
}
