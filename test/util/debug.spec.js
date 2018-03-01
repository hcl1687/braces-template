var _ = require('src/util')
var Vue = require('src')
var config = require('src/config')
var warnPrefix = '[Vue warn]: '
if (typeof console !== 'undefined') {
  var oldError = console['error']
  describe('Util - Debug', function () {
    beforeEach(function () {
      if (_.isIE8) {
        console.error = jasmine.createSpy('error')
      } else {
        spyOn(console, 'error')
      }
    })

    afterEach(function () {
      if (_.isIE8) {
        console.error = oldError
      }
    })

    it('warn when silent is false', function () {
      config.silent = false
      _.warn('oops')
      expect(console.error).toHaveBeenCalledWith(warnPrefix + 'oops')
    })

    it('format component name', function () {
      config.silent = false
      _.warn('oops', new Vue({ name: 'foo' }))
      expect(console.error).toHaveBeenCalledWith(warnPrefix + 'oops (found in component: <foo>)')
      _.warn('oops', { name: 'bar' })
      expect(console.error).toHaveBeenCalledWith(warnPrefix + 'oops (found in component: <bar>)')
    })

    it('not warn when silent is ture', function () {
      config.silent = true
      _.warn('oops')
      expect(console.error).not.toHaveBeenCalled()
      config.silent = false
    })
  })
}
