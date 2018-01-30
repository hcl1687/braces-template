import Vue from 'src'
import config from 'src/config'
var _ = require('src/util/index')

describe('Global API', function () {
  it('exposed utilities', function () {
    expect(Vue.util).to.equal(_)
    expect(Vue.nextTick).to.equal(_.nextTick)
    expect(Vue.config).to.equal(config)
  })

  describe('Asset registration', function () {
    it('directive', function () {
      var assets = ['directive']
      assets.forEach(function (type) {
        var def = {}
        Vue[type]('test', def)
        expect(Vue.options[type + 's'].test).to.equal(def)
        expect(Vue[type]('test')).to.equal(def)
      })
    })
  })
})
