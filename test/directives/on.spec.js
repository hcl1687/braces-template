var _ = require('src/util')
var Vue = require('src')

function trigger (target, event, process) {
  var e
  if (_.isIE8) {
    e = document.createEventObject()
    if (event === 'click') {
      e.button = 1
    }
    if (process) process(e)
    target.fireEvent('on' + event, e)
    return e
  }
  e = document.createEvent('HTMLEvents')
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
    var spy = jasmine.createSpy()
    var vm = new Vue({
      el: el,
      data: {a: 1},
      methods: {
        test: spy
      }
    })
    var a = el.firstChild
    trigger(a, 'click')
    expect(spy.calls.count()).toBe(1)
    vm.$destroy()
    trigger(a, 'click')
    expect(spy.calls.count()).toBe(1)
  })

  it('shorthand', function () {
    el.innerHTML = '<a @click="test"></a>'
    var spy = jasmine.createSpy()
    var vm = new Vue({
      el: el,
      data: {a: 1},
      methods: {
        test: spy
      }
    })
    var a = el.firstChild
    trigger(a, 'click')
    expect(spy.calls.count()).toBe(1)
    vm.$destroy()
    trigger(a, 'click')
    expect(spy.calls.count()).toBe(1)
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
      expect(vm.b).toBe(2)
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
      expect(vm.b).toBe(2)
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
      expect(vm.b).toBe(2)
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
      expect(vm.b).toBe(2)
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
      expect(vm.b).toBe(2)
      done()
    })
  })

  it('stop modifier', function () {
    var outer = jasmine.createSpy('outer')
    var inner = jasmine.createSpy('inner')
    el.innerHTML = '<div @click="outer"><div class="inner" @click.stop="inner"></div></div>'
    new Vue({
      el: el,
      methods: {
        outer: outer,
        inner: inner
      }
    })
    trigger(el.querySelector('.inner'), 'click')
    expect(inner).toHaveBeenCalled()
    expect(outer).not.toHaveBeenCalled()
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
          if (_.isIE8) {
            prevented = !e.returnValue
          } else {
            prevented = e.defaultPrevented
          }
        }
      }
    })
    trigger(el.firstChild, 'click')
    expect(prevented).toBe(true)
  })

  it('prevent modifier with no value', function () {
    el.innerHTML = '<a href="#123" @click.prevent>'
    new Vue({
      el: el
    })
    var hash = window.location.hash
    trigger(el.firstChild, 'click')
    expect(window.location.hash).toBe(hash)
  })

  it('capture modifier', function () {
    document.body.appendChild(el)
    var outer = jasmine.createSpy('outer')
    var inner = jasmine.createSpy('inner')
    el.innerHTML = '<div @click.capture.stop="outer"><div class="inner" @click="inner"></div></div>'
    new Vue({
      el: el,
      methods: {
        outer: outer,
        inner: inner
      }
    })
    if (_.isIE8) {
      expect(_.warn.msg).toContain('no support capture mode in ie8')
    } else {
      trigger(el.querySelector('.inner'), 'click')
      expect(outer).toHaveBeenCalled()
      expect(inner).not.toHaveBeenCalled()
    }
    document.body.removeChild(el)
  })

  it('self modifier', function () {
    var outer = jasmine.createSpy('outer')
    el.innerHTML = '<div class="outer" @click.self="outer"><div class="inner"></div></div>'
    new Vue({
      el: el,
      methods: {
        outer: outer
      }
    })
    trigger(el.querySelector('.inner'), 'click')
    expect(outer).not.toHaveBeenCalled()
    trigger(el.querySelector('.outer'), 'click')
    expect(outer).toHaveBeenCalled()
  })

  it('multiple modifiers working together', function () {
    var outer = jasmine.createSpy('outer')
    var prevented
    el.innerHTML = '<div @keyup="outer"><input class="inner" @keyup.enter.stop.prevent="inner"></div></div>'
    new Vue({
      el: el,
      methods: {
        outer: outer,
        inner: function (e) {
          if (_.isIE8) {
            prevented = !e.returnValue
          } else {
            prevented = e.defaultPrevented
          }
        }
      }
    })
    trigger(el.querySelector('.inner'), 'keyup', function (e) {
      e.keyCode = 13
    })
    expect(outer).not.toHaveBeenCalled()
    expect(prevented).toBe(true)
  })

  it('warn non-function values', function () {
    el.innerHTML = '<a v-on:keyup="test"></a>'
    new Vue({
      el: el,
      data: { test: 123 }
    })
    expect(_.warn.msg).toContain('expects a function value')
  })

  it('iframe', function () {
    // iframes only gets contentWindow when inserted
    // into the document
    document.body.appendChild(el)
    var spy = jasmine.createSpy()
    el.innerHTML = '<iframe v-on:click="test"></iframe>'
    var vm = new Vue({
      el: el,
      methods: {
        test: spy
      }
    })

    var iframeDoc = el.firstChild.contentDocument
    if (_.isIE8) {
      expect(_.warn.msg).toContain('no support iframe bind in ie8')
    } else {
      trigger(iframeDoc, 'click')
      expect(spy.calls.count()).toBe(1)
      vm.$destroy()
      trigger(iframeDoc, 'click')
      expect(spy.calls.count()).toBe(1)
    }

    document.body.removeChild(el)
  })

  it('passing $event', function () {
    var test = jasmine.createSpy()
    el.innerHTML = '<a v-on:click="test($event)"></a>'
    new Vue({
      el: el,
      methods: {
        test: test
      }
    })
    var e = trigger(el.firstChild, 'click')
    expect(test).toHaveBeenCalledWith(e)
  })
})
