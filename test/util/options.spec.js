var _ = require('src/util')
var merge = _.mergeOptions
var __ = require('src/util/debug')

describe('Util - Option merging', function () {
  it('default strat', function () {
    // child undefined
    var res = merge({replace: true}, {}).replace
    expect(res).toBe(true)
    // child overwrite
    res = merge({replace: true}, {replace: false}).replace
    expect(res).toBe(false)
  })

  it('hooks', function () {
    var fn1 = function () {}
    var fn2 = function () {}
    var res
    // parent undefined
    res = merge({}, {created: fn1}).created
    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBe(1)
    expect(res[0]).toBe(fn1)
    // child undefined
    res = merge({created: [fn1]}, {}).created
    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBe(1)
    expect(res[0]).toBe(fn1)
    // both defined
    res = merge({created: [fn1]}, {created: fn2}).created
    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBe(2)
    expect(res[0]).toBe(fn1)
    expect(res[1]).toBe(fn2)
  })

  it('events', function () {
    // no parent
    var res = merge({}, {events: 1})
    expect(res.events).toBe(1)
    // no child
    res = merge({events: 1}, {})
    expect(res.events).toBe(1)

    var fn1 = function () {}
    var fn2 = function () {}
    var fn3 = function () {}
    var parent = {
      events: {
        'fn1': [fn1, fn2],
        'fn2': fn2
      }
    }
    var child = {
      events: {
        'fn1': fn3,
        'fn2': fn3,
        'fn3': fn3
      }
    }
    res = merge(parent, child).events
    assertRes(res.fn1, [fn1, fn2, fn3])
    assertRes(res.fn2, [fn2, fn3])
    assertRes(res.fn3, [fn3])

    function assertRes (res, expected) {
      expect(Array.isArray(res)).toBe(true)
      expect(res.length).toBe(expected.length)
      var i = expected.length
      while (i--) {
        expect(res[i]).toBe(expected[i])
      }
    }
  })

  it('normal object hashes', function () {
    var fn1 = function () {}
    var fn2 = function () {}
    var res
    // parent undefined
    res = merge({}, {methods: {test: fn1}}).methods
    expect(res.test).toBe(fn1)
    // child undefined
    res = merge({methods: {test: fn1}}, {}).methods
    expect(res.test).toBe(fn1)
    // both defined
    var parent = {methods: {test: fn1}}
    res = merge(parent, {methods: {test2: fn2}}).methods
    expect(res.test).toBe(fn1)
    expect(res.test2).toBe(fn2)
  })

  it('assets', function () {
    var asset1 = {
      test: 1
    }
    var asset2 = {
      test: 2
    }
    var res = merge({
      directives: {
        a: asset1
      }
    }, {
      directives: {
        b: asset2
      }
    }).directives
    expect(res.a.test).toBe(asset1.test)
    expect(res.b.test).toBe(asset2.test)
  })

  it('should ignore non-function el & data in class merge', function () {
    var res = merge({}, {el: 1, data: 2})
    expect(res.el).toBe(undefined)
    expect(res.data).toBe(undefined)
  })

  it('class el merge', function () {
    function fn1 () {}
    function fn2 () {}
    var res = merge({ el: fn1 }, { el: fn2 })
    expect(res.el).toBe(fn2)
  })

  it('class data merge', function () {
    function fn1 () {
      return {
        a: 1,
        c: 4,
        d: {
          e: 1
        }
      }
    }
    function fn2 () {
      return {
        a: 2,
        b: 3,
        d: {
          f: 2
        }
      }
    }
    // both present
    var res = merge({ data: fn1 }, { data: fn2 }).data()
    expect(res.a).toBe(2)
    expect(res.b).toBe(3)
    expect(res.c).toBe(4)
    expect(res.d.e).toBe(1)
    expect(res.d.f).toBe(2)
    // only parent
    res = merge({ data: fn1 }, {}).data()
    expect(res.a).toBe(1)
    expect(res.b).toBe(undefined)
    expect(res.c).toBe(4)
    expect(res.d.e).toBe(1)
    expect(res.d.f).toBe(undefined)
  })

  it('instanace el merge', function () {
    var vm = {} // mock vm presence
    function fn1 () {
      expect(this).toBe(vm)
      return 1
    }
    function fn2 () {
      expect(this).toBe(vm)
      return 2
    }
    // both functions
    var res = merge({ el: fn1 }, { el: fn2 }, vm)
    expect(res.el).toBe(2)
    // direct instance el
    res = merge({ el: fn1 }, { el: 2 }, vm)
    expect(res.el).toBe(2)
    // no parent
    res = merge({}, { el: 2 }, vm)
    expect(res.el).toBe(2)
    // no child
    res = merge({ el: fn1 }, {}, vm)
    expect(res.el).toBe(1)
  })

  it('instance data merge with no instance data', function () {
    var res = merge(
      {
        data: function () {
          return {
            a: 1
          }
        }
      },
      {}, // no instance data
      {} // mock vm presence
    )
    expect(res.data().a).toBe(1)
  })

  it('instance data merge with default data function', function () {
    var vm = {} // mock vm presence
    var res = merge(
      // component default
      {
        data: function () {
          expect(this).toBe(vm)
          return {
            a: 1,
            b: 2
          }
        }
      }, {
        data: {
          a: 2
        }
      }, // instance data
      vm
    )
    var data = res.data()
    expect(data.a).toBe(2)
    expect(data.b).toBe(2)
  })

  it('mixins', function () {
    var a = {
      test: 1
    }
    var b = {
      test: 2
    }
    var c = {
      test: 3
    }
    var d = {
      test: 4
    }
    var f1 = function () {}
    var f2 = function () {}
    var f3 = function () {}
    var f4 = function () {}
    var mixinA = { a: 1, directives: { a: a }, created: f2 }
    var mixinB = { b: 1, directives: { b: b }, created: f3 }
    var res = merge({
      a: 2,
      directives: { c: c },
      created: [f1]
    }, {
      directives: { d: d },
      mixins: [mixinA, mixinB],
      created: f4
    })
    expect(res.a).toBe(1)
    expect(res.b).toBe(1)
    expect(res.directives.a.test).toBe(a.test)
    expect(res.directives.b.test).toBe(b.test)
    expect(res.directives.c.test).toBe(c.test)
    expect(res.directives.d.test).toBe(d.test)
    expect(res.created[0]).toBe(f1)
    expect(res.created[1]).toBe(f2)
    expect(res.created[2]).toBe(f3)
    expect(res.created[3]).toBe(f4)
  })

  it('Array assets', function () {
    var a = {
      directives: {
        a: {
          name: 'a'
        }
      }
    }
    var b = {
      directives: [{ name: 'b' }]
    }
    var res = merge(a, b)
    expect(res.directives.a.name).toBe(a.directives.a.name)
    expect(res.directives.b.name).toBe(b.directives[0].name)
  })

  it('warn Array assets without id', function () {
    var a = {
      directives: {
        a: {
          name: 'a'
        }
      }
    }
    var b = {
      directives: [{}]
    }
    merge(a, b)
    expect(__.warn.msg).toContain('Array-syntax assets must provide a "name" or "id" field.')
  })
})
