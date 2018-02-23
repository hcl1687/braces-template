var _ = require('src/util')
var Vue = require('src')
var compiler = require('src/compiler')

describe('Lifecycle API', function () {
  describe('$mount', function () {
    var el, frag
    beforeEach(function () {
      el = document.createElement('div')
      el.textContent = '{{test}}'
      frag = document.createDocumentFragment()
      frag.appendChild(el)
    })

    it('normal', function () {
      var vm = new Vue({
        data: {
          test: 'foo'
        }
      })
      vm.$mount(el)
      expect(vm.$el).to.equal(el)
      expect(el.__vue__).to.equal(vm)
      expect(el.textContent).to.equal('foo')
    })

    it('selector', function () {
      el.id = 'mount-test'
      document.body.appendChild(el)
      var vm = new Vue({
        data: { test: 'foo' }
      })
      vm.$mount('#mount-test')
      expect(vm.$el).to.equal(el)
      expect(el.__vue__).to.equal(vm)
      expect(el.textContent).to.equal('foo')
      document.body.removeChild(el)
    })

    it('warn invalid selector', function () {
      var vm = new Vue()
      vm.$mount('#none-exist')
      expect(_.warn.msg).to.include('Cannot find element')
    })

    it('hooks', function () {
      var hooks = ['created', 'beforeCompile', 'compiled', 'attached', 'ready']
      var options = {
        data: {
          test: 'foo'
        }
      }
      hooks.forEach(function (hook) {
        options[hook] = sinon.spy()
      })
      var vm = new Vue(options)
      expect(options.created.called).to.equal(true)
      expect(options.beforeCompile.called).to.equal(false)
      vm.$mount(el)
      expect(options.beforeCompile.called).to.equal(true)
      expect(options.compiled.called).to.equal(true)
      expect(options.attached.called).to.equal(false)
      expect(options.ready.called).to.equal(false)
      vm.$appendTo(document.body)
      expect(options.attached.called).to.equal(true)
      expect(options.ready.called).to.equal(true)
      vm.$remove()
    })

    it('warn against multiple calls', function () {
      var vm = new Vue({
        el: el
      })
      vm.$mount(el)
      expect(_.warn.msg).to.include('$mount() should be called only once')
    })
  })

  describe('$destroy', function () {
    it('normal', function () {
      var vm = new Vue()
      expect(vm._isDestroyed).to.equal(false)
      vm.$destroy()
      expect(vm._isDestroyed).to.equal(true)
      expect(vm.$el).to.equal(null)
      expect(vm.$parent).to.equal(null)
      expect(vm.$root).to.equal(null)
      expect(vm._directives).to.equal(null)
      expect(Object.keys(vm._events).length).to.equal(0)
    })

    it('remove element', function () {
      var el = document.createElement('div')
      var parent = document.createElement('div')
      parent.appendChild(el)
      var vm = new Vue({ el: el })
      vm.$destroy(true)
      expect(parent.childNodes.length).to.equal(0)
      expect(el.__vue__).to.equal(null)
    })

    it('hooks', function () {
      var opts = {
        beforeDestroy: sinon.spy(),
        destroyed: sinon.spy(),
        detached: sinon.spy()
      }
      var el = opts.el = document.createElement('div')
      document.body.appendChild(el)
      var vm = new Vue(opts)
      vm.$destroy(true)
      expect(opts.beforeDestroy.called).to.equal(true)
      expect(opts.destroyed.called).to.equal(true)
      expect(opts.detached.called).to.equal(true)
    })

    it('directives', function () {
      var spy = sinon.spy()
      var el = document.createElement('div')
      el.innerHTML = '<div v-test></div>'
      var vm = new Vue({
        el: el,
        directives: {
          test: {
            unbind: spy
          }
        }
      })
      vm.$destroy()
      expect(spy.called).to.equal(true)
    })

    it('refuse multiple calls', function () {
      var spy = sinon.spy()
      var vm = new Vue({
        beforeDestroy: spy
      })
      vm.$destroy()
      vm.$destroy()
      expect(spy.callCount).to.equal(1)
    })
  })

  describe('$compile', function () {
    it('should partial compile and teardown stuff', function () {
      var el = document.createElement('div')
      el.innerHTML = '{{a}}'
      var vm = new Vue({
        el: el,
        data: {
          a: 'foo'
        }
      })
      expect(vm._directives.length).to.equal(1)
      var partial = document.createElement('span')
      partial.textContent = '{{a}}'
      var decompile = vm.$compile(partial)
      expect(partial.textContent).to.equal('foo')
      expect(vm._directives.length).to.equal(2)
      decompile()
      expect(vm._directives.length).to.equal(1)
    })
  })
})
