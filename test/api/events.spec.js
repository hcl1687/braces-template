var Vue = require('src')

describe('Events API', function () {
  var vm, spy
  beforeEach(function () {
    vm = new Vue()
    spy = sinon.spy()
  })

  it('$on', function () {
    vm.$on('test', function () {
      // expect correct context
      expect(this).to.equal(vm)
      spy.apply(this, arguments)
    })
    vm.$emit('test', 1, 2, 3, 4)
    expect(spy.callCount).to.equal(1)
    expect(spy.calledWith(1, 2, 3, 4)).to.equal(true)
  })

  it('$once', function () {
    vm.$once('test', spy)
    vm.$emit('test', 1, 2, 3)
    vm.$emit('test', 2, 3, 4)
    expect(spy.callCount).to.equal(1)
    expect(spy.calledWith(1, 2, 3)).to.equal(true)
  })

  it('$off', function () {
    vm.$on('test1', spy)
    vm.$on('test2', spy)
    vm.$off()
    vm.$emit('test1')
    vm.$emit('test2')
    expect(spy.callCount).to.equal(0)
  })

  it('$off event', function () {
    vm.$on('test1', spy)
    vm.$on('test2', spy)
    vm.$off('test1')
    vm.$off('test1') // test off something that's already off
    vm.$emit('test1', 1)
    vm.$emit('test2', 2)
    expect(spy.callCount).to.equal(1)
    expect(spy.calledWith(2)).to.equal(true)
  })

  it('$off event + fn', function () {
    var spy2 = sinon.spy()
    vm.$on('test', spy)
    vm.$on('test', spy2)
    vm.$off('test', spy)
    vm.$emit('test', 1, 2, 3)
    expect(spy.callCount).to.equal(0)
    expect(spy2.callCount).to.equal(1)
    expect(spy2.calledWith(1, 2, 3)).to.equal(true)
  })
})
