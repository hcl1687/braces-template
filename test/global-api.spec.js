var Vue = require('src')
var config = require('src/config')
var _ = require('src/util/index')

describe('Global API', function () {
  it('exposed utilities', function () {
    var ret = true
    for (var key in _) {
      if (key !== 'default' && Object.prototype.hasOwnProperty.call(_, key)) {
        ret = Object.prototype.hasOwnProperty.call(Vue.util, key)
      }
    }
    expect(ret).toBe(true)
    expect(Vue.nextTick).toBe(_.nextTick)
    expect(Vue.config).toBe(config)
  })

  describe('Asset registration', function () {
    it('directive', function () {
      var assets = ['directive']
      assets.forEach(function (type) {
        var def = {}
        Vue[type]('test', def)
        expect(Vue.options[type + 's'].test).toBe(def)
        expect(Vue[type]('test')).toBe(def)
      })
    })
  })
})
