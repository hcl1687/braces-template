var _ = require('src/util')
var Vue = require('src')

function trigger (target, event, process) {
  var e = document.createEvent('HTMLEvents')
  e.initEvent(event, true, true)
  if (process) process(e)
  target.dispatchEvent(e)
  return e
}

describe('v-on', function () {
  var el
  beforeEach(function () {
    el = document.createElement('div')
  })

  it('methods', function () {
    el.innerHTML = '<a v-on:click="test"></a>'
    var spy = sinon.spy()
    var vm = new Vue({
      el: el,
      data: {a: 1},
      methods: {
        test: spy
      }
    })
    var a = el.firstChild
    trigger(a, 'click')
    expect(spy.callCount).to.equal(1)
    vm.$destroy()
    trigger(a, 'click')
    expect(spy.callCount).to.equal(1)
  })

  it('shorthand', function () {
    el.innerHTML = '<a @click="test"></a>'
    var spy = sinon.spy()
    var vm = new Vue({
      el: el,
      data: {a: 1},
      methods: {
        test: spy
      }
    })
    var a = el.firstChild
    trigger(a, 'click')
    expect(spy.callCount).to.equal(1)
    vm.$destroy()
    trigger(a, 'click')
    expect(spy.callCount).to.equal(1)
  })

  it('with key modifier', function (done) {
    el.innerHTML = '<a v-on:keyup.enter="test">{{a}}</a>'
    var vm = new Vue({
      el: el,
      data: {a: 1, b: 1},
      methods: {
        test: function () {
          this.b++
        }
      }
    })
    var a = el.firstChild
    trigger(a, 'keyup', function (e) {
      e.keyCode = 13
    })
    _.nextTick(function () {
      expect(vm.b).to.equal(2)
      done()
    })
  })

  it('with delete modifier capturing DEL', function (done) {
    el.innerHTML = '<a v-on:keyup.delete="test">{{a}}</a>'
    var vm = new Vue({
      el: el,
      data: {a: 1, b: 1},
      methods: {
        test: function () {
          this.b++
        }
      }
    })
    var a = el.firstChild
    trigger(a, 'keyup', function (e) {
      e.keyCode = 46
    })
    _.nextTick(function () {
      expect(vm.b).to.equal(2)
      done()
    })
  })

  it('with delete modifier capturing backspace', function (done) {
    el.innerHTML = '<a v-on:keyup.delete="test">{{a}}</a>'
    var vm = new Vue({
      el: el,
      data: {a: 1, b: 1},
      methods: {
        test: function () {
          this.b++
        }
      }
    })
    var a = el.firstChild
    trigger(a, 'keyup', function (e) {
      e.keyCode = 8
    })
    _.nextTick(function () {
      expect(vm.b).to.equal(2)
      done()
    })
  })

  it('with key modifier (keycode)', function (done) {
    el.innerHTML = '<a v-on:keyup.13="test">{{a}}</a>'
    var vm = new Vue({
      el: el,
      data: {a: 1, b: 1},
      methods: {
        test: function () {
          this.b++
        }
      }
    })
    var a = el.firstChild
    trigger(a, 'keyup', function (e) {
      e.keyCode = 13
    })
    _.nextTick(function () {
      expect(vm.b).to.equal(2)
      done()
    })
  })

  it('with key modifier (letter)', function (done) {
    el.innerHTML = '<a v-on:keyup.a="test">{{a}}</a>'
    var vm = new Vue({
      el: el,
      data: {a: 1, b: 1},
      methods: {
        test: function () {
          this.b++
        }
      }
    })
    var a = el.firstChild
    trigger(a, 'keyup', function (e) {
      e.keyCode = 65
    })
    _.nextTick(function () {
      expect(vm.b).to.equal(2)
      done()
    })
  })

  it('stop modifier', function () {
    var outer = sinon.spy()
    var inner = sinon.spy()
    el.innerHTML = '<div @click="outer"><div class="inner" @click.stop="inner"></div></div>'
    new Vue({
      el: el,
      methods: {
        outer: outer,
        inner: inner
      }
    })
    trigger(el.querySelector('.inner'), 'click')
    expect(inner.called).to.equal(true)
    expect(outer.called).to.equal(false)
  })

  it('prevent modifier', function () {
    var prevented
    el.innerHTML = '<a href="#" @click.prevent="onClick">'
    new Vue({
      el: el,
      methods: {
        onClick: function (e) {
          // store the prevented state now:
          // IE will reset the `defaultPrevented` flag
          // once the event handler call stack is done!
          prevented = e.defaultPrevented
        }
      }
    })
    trigger(el.firstChild, 'click')
    expect(prevented).to.equal(true)
  })

  it('prevent modifier with no value', function () {
    el.innerHTML = '<a href="#123" @click.prevent>'
    new Vue({
      el: el
    })
    var hash = window.location.hash
    trigger(el.firstChild, 'click')
    expect(window.location.hash).to.equal(hash)
  })

  it('capture modifier', function () {
    document.body.appendChild(el)
    var outer = sinon.spy()
    var inner = sinon.spy()
    el.innerHTML = '<div @click.capture.stop="outer"><div class="inner" @click="inner"></div></div>'
    new Vue({
      el: el,
      methods: {
        outer: outer,
        inner: inner
      }
    })
    trigger(el.querySelector('.inner'), 'click')
    expect(outer.called).to.equal(true)
    expect(inner.called).to.equal(false)
    document.body.removeChild(el)
  })

  it('self modifier', function () {
    var outer = sinon.spy()
    el.innerHTML = '<div class="outer" @click.self="outer"><div class="inner"></div></div>'
    new Vue({
      el: el,
      methods: {
        outer: outer
      }
    })
    trigger(el.querySelector('.inner'), 'click')
    expect(outer.called).to.equal(false)
    trigger(el.querySelector('.outer'), 'click')
    expect(outer.called).to.equal(true)
  })

  it('multiple modifiers working together', function () {
    var outer = sinon.spy()
    var prevented
    el.innerHTML = '<div @keyup="outer"><input class="inner" @keyup.enter.stop.prevent="inner"></div></div>'
    new Vue({
      el: el,
      methods: {
        outer: outer,
        inner: function (e) {
          prevented = e.defaultPrevented
        }
      }
    })
    trigger(el.querySelector('.inner'), 'keyup', function (e) {
      e.keyCode = 13
    })
    expect(outer.called).to.equal(false)
    expect(prevented).to.equal(true)
  })

  it('warn non-function values', function () {
    el.innerHTML = '<a v-on:keyup="test"></a>'
    new Vue({
      el: el,
      data: { test: 123 }
    })
    expect(_.warn.msg).to.include('expects a function value')
  })

  it('iframe', function () {
    // iframes only gets contentWindow when inserted
    // into the document
    document.body.appendChild(el)
    var spy = sinon.spy()
    el.innerHTML = '<iframe v-on:click="test"></iframe>'
    var vm = new Vue({
      el: el,
      methods: {
        test: spy
      }
    })
    var iframeDoc = el.firstChild.contentDocument
    trigger(iframeDoc, 'click')
    expect(spy.callCount).to.equal(1)
    vm.$destroy()
    trigger(iframeDoc, 'click')
    expect(spy.callCount).to.equal(1)
    document.body.removeChild(el)
  })

  it('passing $event', function () {
    var test = sinon.spy()
    el.innerHTML = '<a v-on:click="test($event)"></a>'
    new Vue({
      el: el,
      methods: {
        test: test
      }
    })
    var e = trigger(el.firstChild, 'click')
    expect(test.calledWith(e)).to.equal(true)
  })
})
