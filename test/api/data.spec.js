var Vue = require('src')
var _ = require('src/util')
var nextTick = _.nextTick

describe('Data API', function () {
  var vm
  beforeEach(function () {
    var el = document.createElement('div')
    el.setAttribute('prop', 'foo')
    vm = new Vue({
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
    expect(vm.$get('a')).to.equal(1)
    expect(vm.$get('b["c"]')).to.equal(2)
    expect(vm.$get('a + b.c')).to.equal(3)
    expect(vm.$get('c')).to.equal(undefined)
    // invalid, should warn
    vm.$get('a(')
    expect(_.warn.msg).to.include('Invalid expression')
  })
})
