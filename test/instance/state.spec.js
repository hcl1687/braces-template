var Braces = require('src')
var _ = require('src/util')

describe('Instance state initialization', function () {
  it('should warn data functions that do not return an object', function () {
    new Braces({
      data: function () {}
    })
    expect(_.warn.msg).toContain('should return an object')
  })

  it('should initialize data once per strat', function () {
    var spyOncePerStrat = jasmine.createSpy('called once per strat')
    new Braces({
      data: function () {
        spyOncePerStrat()
        return {
          result: 'false'
        }
      }
    })
    expect(spyOncePerStrat.calls.count()).toBe(1)
  })

  describe('data proxy', function () {
    var data = {
      a: 0,
      b: 0
    }
    var vm = new Braces({
      data: data
    })

    it('initial', function () {
      expect(vm.a).toBe(data.a)
      expect(vm.b).toBe(data.b)
    })
  })

  describe('methods', function () {
    it('should work and have correct context', function () {
      var vm = new Braces({
        data: {
          a: 1
        },
        methods: {
          test: function () {
            expect(this instanceof Braces).toBe(true)
            return this.a
          }
        }
      })
      expect(vm.test()).toBe(1)
    })
  })
})
