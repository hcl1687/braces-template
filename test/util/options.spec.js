var _ = require('src/util')
var Vue = require('src')
var merge = _.mergeOptions
var resolveAsset = _.resolveAsset
var __ = require('src/util/debug')

describe('Util - Option merging', function () {
  it('default strat', function () {
    // child undefined
    var res = merge({replace: true}, {}).replace
    expect(res).to.equal(true)
    // child overwrite
    res = merge({replace: true}, {replace: false}).replace
    expect(res).to.equal(false)
  })

  it('hooks', function () {
    var fn1 = function () {}
    var fn2 = function () {}
    var res
    // parent undefined
    res = merge({}, {created: fn1}).created
    expect(Array.isArray(res)).to.equal(true)
    expect(res.length).to.equal(1)
    expect(res[0]).to.equal(fn1)
    // child undefined
    res = merge({created: [fn1]}, {}).created
    expect(Array.isArray(res)).to.equal(true)
    expect(res.length).to.equal(1)
    expect(res[0]).to.equal(fn1)
    // both defined
    res = merge({created: [fn1]}, {created: fn2}).created
    expect(Array.isArray(res)).to.equal(true)
    expect(res.length).to.equal(2)
    expect(res[0]).to.equal(fn1)
    expect(res[1]).to.equal(fn2)
  })

  it('events', function () {
    // no parent
    var res = merge({}, {events: 1})
    expect(res.events).to.equal(1)
    // no child
    res = merge({events: 1}, {})
    expect(res.events).to.equal(1)

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
      expect(Array.isArray(res)).to.equal(true)
      expect(res.length).to.equal(expected.length)
      var i = expected.length
      while (i--) {
        expect(res[i]).to.equal(expected[i])
      }
    }
  })

  it('normal object hashes', function () {
    var fn1 = function () {}
    var fn2 = function () {}
    var res
    // parent undefined
    res = merge({}, {methods: {test: fn1}}).methods
    expect(res.test).to.equal(fn1)
    // child undefined
    res = merge({methods: {test: fn1}}, {}).methods
    expect(res.test).to.equal(fn1)
    // both defined
    var parent = {methods: {test: fn1}}
    res = merge(parent, {methods: {test2: fn2}}).methods
    expect(res.test).to.equal(fn1)
    expect(res.test2).to.equal(fn2)
  })

  it('assets', function () {
    var asset1 = {}
    var asset2 = {}
    var res = merge({
      directives: {
        a: asset1
      }
    }, {
      directives: {
        b: asset2
      }
    }).directives
    expect(res.a).to.equal(asset1)
    expect(res.b).to.equal(asset2)
  })

  it('should ignore non-function el & data in class merge', function () {
    var res = merge({}, {el: 1, data: 2})
    expect(res.el).to.equal(undefined)
    expect(res.data).equal(undefined)
  })

  it('class el merge', function () {
    function fn1 () {}
    function fn2 () {}
    var res = merge({ el: fn1 }, { el: fn2 })
    expect(res.el).to.equal(fn2)
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
    expect(res.a).to.equal(2)
    expect(res.b).to.equal(3)
    expect(res.c).to.equal(4)
    expect(res.d.e).to.equal(1)
    expect(res.d.f).to.equal(2)
    // only parent
    res = merge({ data: fn1 }, {}).data()
    expect(res.a).to.equal(1)
    expect(res.b).to.equal(undefined)
    expect(res.c).to.equal(4)
    expect(res.d.e).to.equal(1)
    expect(res.d.f).to.equal(undefined)
  })

  it('instanace el merge', function () {
    var vm = {} // mock vm presence
    function fn1 () {
      expect(this).to.equal(vm)
      return 1
    }
    function fn2 () {
      expect(this).to.equal(vm)
      return 2
    }
    // both functions
    var res = merge({ el: fn1 }, { el: fn2 }, vm)
    expect(res.el).to.equal(2)
    // direct instance el
    res = merge({ el: fn1 }, { el: 2 }, vm)
    expect(res.el).to.equal(2)
    // no parent
    res = merge({}, { el: 2 }, vm)
    expect(res.el).to.equal(2)
    // no child
    res = merge({ el: fn1 }, {}, vm)
    expect(res.el).to.equal(1)
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
    expect(res.data().a).to.equal(1)
  })

  it('instance data merge with default data function', function () {
    var vm = {} // mock vm presence
    var res = merge(
      // component default
      {
        data: function () {
          expect(this).to.equal(vm)
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
    expect(data.a).to.equal(2)
    expect(data.b).to.equal(2)
  })

  it('mixins', function () {
    var a = {}
    var b = {}
    var c = {}
    var d = {}
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
    expect(res.a).to.equal(1)
    expect(res.b).to.equal(1)
    expect(res.directives.a).to.equal(a)
    expect(res.directives.b).to.equal(b)
    expect(res.directives.c).to.equal(c)
    expect(res.directives.d).to.equal(d)
    expect(res.created[0]).to.equal(f1)
    expect(res.created[1]).to.equal(f2)
    expect(res.created[2]).to.equal(f3)
    expect(res.created[3]).to.equal(f4)
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
    expect(res.directives.a).to.equal(a.directives.a)
    expect(res.directives.b).to.equal(b.directives[0])
  })

  it('warn Array assets without id', function () {
    const _spy = sinon.spy(__, 'warn')
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
    expect(_spy.calledWith('Array-syntax assets must provide a "name" or "id" field.')).to.equal(true)
  })

  // it('warn Array async component without id', function () {
  //   var a = {
  //     components: {
  //       a: Vue.extend({})
  //     }
  //   }
  //   var b = {
  //     components: [function () {}]
  //   }
  //   merge(a, b)
  //   expect('must provide a "name" or "id" field').toHaveBeenWarned()
  // })
})

// describe('Util - Option resolveAsset', function () {
//   var vm
//   beforeEach(function () {
//     vm = new Vue({
//       data: {},
//       components: {
//         'hyphenated-component': {
//           template: 'foo'
//         },
//         camelCasedComponent: {
//           template: 'bar'
//         },
//         PascalCasedComponent: {
//           template: 'baz'
//         }
//       }
//     })
//   })

//   it('resolves', function () {
//     expect(resolveAsset(vm.$options, 'components', 'hyphenated-component')).toBeTruthy()
//     expect(resolveAsset(vm.$options, 'components', 'camel-cased-component')).toBeTruthy()
//     expect(resolveAsset(vm.$options, 'components', 'pascal-cased-component')).toBeTruthy()
//   })
// })
