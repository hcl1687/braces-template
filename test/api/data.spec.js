var Braces = require('src')
var _ = require('src/util')

describe('Data API', function () {
  var vm
  beforeEach(function () {
    var el = document.createElement('div')
    el.setAttribute('prop', 'foo')
    vm = new Braces({
      el: el,
      data: {
        a: 1,
        b: {
          c: 2
        }
      }
    })
  })

  it('$get', function () {
    expect(vm.$get('a')).toBe(1)
    expect(vm.$get('b["c"]')).toBe(2)
    expect(vm.$get('a + b.c')).toBe(3)
    expect(vm.$get('c')).toBeUndefined()
    // invalid, should warn
    vm.$get('a(')
    expect(_.warn.msg).toContain('Invalid expression')
  })
})
