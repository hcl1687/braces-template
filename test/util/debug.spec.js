var _ = require('src/util')
var Vue = require('src')
var config = require('src/config')
var warnPrefix = '[Vue warn]: '

if (typeof console !== 'undefined') {
  describe('Util - Debug', function () {
    beforeEach(function () {
      sinon.spy(console, 'error')
    })
    afterEach(function () {
      console.error.restore()
    })

    it('warn when silent is false', function () {
      config.silent = false
      _.warn('oops')
      expect(console.error.calledWith(warnPrefix + 'oops')).to.equal(true)
    })

    it('format component name', function () {
      config.silent = false
      _.warn('oops', new Vue({ name: 'foo' }))
      expect(console.error.calledWith(warnPrefix + 'oops (found in component: <foo>)')).to.equal(true)
      _.warn('oops', { name: 'bar' })
      expect(console.error.calledWith(warnPrefix + 'oops (found in component: <bar>)')).to.equal(true)
    })

    it('not warn when silent is ture', function () {
      config.silent = true
      _.warn('oops')
      expect(console.error.called).to.equal(false)
    })
  })
}
