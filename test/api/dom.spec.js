var Braces = require('src')
var _ = require('src/util')

describe('DOM API', function () {
  var vm, vm2, parent, target, sibling, empty, spy
  beforeEach(function () {
    spy = jasmine.createSpy('dom')
    parent = document.createElement('div')
    target = document.createElement('div')
    sibling = document.createElement('div')
    empty = document.createElement('div')
    parent.appendChild(target)
    parent.appendChild(sibling)
    var el = document.createElement('div')
    vm = new Braces({ el: el })
  })

  describe('$appendTo', function () {
    it('normal instance', function () {
      vm.$appendTo(parent, spy)
      expect(parent.childNodes.length).toBe(3)
      expect(parent.lastChild).toBe(vm.$el)
      expect(spy.calls.count()).toBe(1)
    })
  })

  describe('$prependTo', function () {
    it('normal instance', function () {
      vm.$prependTo(parent, spy)
      expect(parent.childNodes.length).toBe(3)
      expect(parent.firstChild).toBe(vm.$el)
      expect(spy.calls.count()).toBe(1)
      vm.$prependTo(empty, spy)
      expect(empty.childNodes.length).toBe(1)
      expect(empty.firstChild).toBe(vm.$el)
      expect(spy.calls.count()).toBe(2)
    })
  })

  describe('$before', function () {
    it('normal instance', function () {
      vm.$before(sibling, spy)
      expect(parent.childNodes.length).toBe(3)
      expect(parent.childNodes[1]).toBe(vm.$el)
      expect(spy.calls.count()).toBe(1)
    })
  })

  describe('$after', function () {
    it('normal instance', function () {
      vm.$after(target, spy)
      expect(parent.childNodes.length).toBe(3)
      expect(parent.childNodes[1]).toBe(vm.$el)
      expect(spy.calls.count()).toBe(1)
    })

    it('normal instance no next sibling', function () {
      vm.$after(sibling, spy)
      expect(parent.childNodes.length).toBe(3)
      expect(parent.lastChild).toBe(vm.$el)
      expect(spy.calls.count()).toBe(1)
    })
  })

  describe('$remove', function () {
    it('normal instance', function () {
      vm.$before(sibling)
      expect(parent.childNodes.length).toBe(3)
      expect(parent.childNodes[1]).toBe(vm.$el)
      vm.$remove(spy)
      expect(parent.childNodes.length).toBe(2)
      expect(parent.childNodes[0]).toBe(target)
      expect(parent.childNodes[1]).toBe(sibling)
      expect(spy.calls.count()).toBe(1)
    })

    it('detached', function () {
      vm.$remove(spy)
      expect(spy.calls.count()).toBe(1)
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
      expect(called).toBe(false)
      _.nextTick(function () {
        expect(called).toBe(true)
        expect(context).toBe(vm)
        done()
      })
    })
  })
})
