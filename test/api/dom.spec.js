var Vue = require('src')
var _ = require('src/util')

describe('DOM API', function () {
  var vm, vm2, parent, target, sibling, empty, spy
  beforeEach(function () {
    spy = sinon.spy()
    parent = document.createElement('div')
    target = document.createElement('div')
    sibling = document.createElement('div')
    empty = document.createElement('div')
    parent.appendChild(target)
    parent.appendChild(sibling)
    var el = document.createElement('div')
    vm = new Vue({ el: el })
  })

  describe('$appendTo', function () {
    it('normal instance', function () {
      vm.$appendTo(parent, spy)
      expect(parent.childNodes.length).to.equal(3)
      expect(parent.lastChild).to.equal(vm.$el)
      expect(spy.callCount).to.equal(1)
    })
  })

  describe('$prependTo', function () {
    it('normal instance', function () {
      vm.$prependTo(parent, spy)
      expect(parent.childNodes.length).to.equal(3)
      expect(parent.firstChild).to.equal(vm.$el)
      expect(spy.callCount).to.equal(1)
      vm.$prependTo(empty, spy)
      expect(empty.childNodes.length).to.equal(1)
      expect(empty.firstChild).to.equal(vm.$el)
      expect(spy.callCount).to.equal(2)
    })
  })

  describe('$before', function () {
    it('normal instance', function () {
      vm.$before(sibling, spy)
      expect(parent.childNodes.length).to.equal(3)
      expect(parent.childNodes[1]).to.equal(vm.$el)
      expect(spy.callCount).to.equal(1)
    })
  })

  describe('$after', function () {
    it('normal instance', function () {
      vm.$after(target, spy)
      expect(parent.childNodes.length).to.equal(3)
      expect(parent.childNodes[1]).to.equal(vm.$el)
      expect(spy.callCount).to.equal(1)
    })

    it('normal instance no next sibling', function () {
      vm.$after(sibling, spy)
      expect(parent.childNodes.length).to.equal(3)
      expect(parent.lastChild).to.equal(vm.$el)
      expect(spy.callCount).to.equal(1)
    })
  })

  describe('$remove', function () {
    it('normal instance', function () {
      vm.$before(sibling)
      expect(parent.childNodes.length).to.equal(3)
      expect(parent.childNodes[1]).to.equal(vm.$el)
      vm.$remove(spy)
      expect(parent.childNodes.length).to.equal(2)
      expect(parent.childNodes[0]).to.equal(target)
      expect(parent.childNodes[1]).to.equal(sibling)
      expect(spy.callCount).to.equal(1)
    })

    it('detached', function () {
      vm.$remove(spy)
      expect(spy.callCount).to.equal(1)
    })
  })

  describe('$nextTick', function () {
    it('should work', function (done) {
      var context
      var called = false
      vm.$nextTick(function () {
        called = true
        context = this
      })
      expect(called).to.equal(false)
      _.nextTick(function () {
        expect(called).to.equal(true)
        expect(context).to.equal(vm)
        done()
      })
    })
  })
})
