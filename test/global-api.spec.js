var Braces = require('src')
var config = require('src/config')
var _ = require('src/util/index')

describe('Global API', function () {
  it('exposed utilities', function () {
    var ret = true
    for (var key in _) {
      if (key !== 'default' && Object.prototype.hasOwnProperty.call(_, key)) {
        ret = Object.prototype.hasOwnProperty.call(Braces.util, key)
      }
    }
    expect(ret).toBe(true)
    expect(Braces.nextTick).toBe(_.nextTick)
    expect(Braces.config).toBe(config)
  })

  describe('Asset registration', function () {
    it('directive', function () {
      var assets = ['directive']
      assets.forEach(function (type) {
        var def = {}
        Braces[type]('test', def)
        expect(Braces.options[type + 's'].test).toBe(def)
        expect(Braces[type]('test')).toBe(def)
      })
    })
  })
})
