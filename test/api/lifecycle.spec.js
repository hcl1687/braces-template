var _ = require('src/util')
var Vue = require('src')
var compiler = require('src/compiler')
var textContent = _.textContent

describe('Lifecycle API', function () {
  describe('$mount', function () {
    var el, frag
    beforeEach(function () {
      el = document.createElement('div')
      textContent(el, '{{test}}')
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
      expect(vm.$el).toBe(el)
      expect(el.__vue__).toBe(vm)
      expect(textContent(el)).toBe('foo')
    })

    it('selector', function () {
      el.id = 'mount-test'
      document.body.appendChild(el)
      var vm = new Vue({
        data: { test: 'foo' }
      })
      vm.$mount('#mount-test')
      expect(vm.$el).toBe(el)
      expect(el.__vue__).toBe(vm)
      expect(textContent(el)).toBe('foo')
      document.body.removeChild(el)
    })

    it('warn invalid selector', function () {
      var vm = new Vue()
      vm.$mount('#none-exist')
      expect(_.warn.msg).toContain('Cannot find element')
    })

    it('hooks', function () {
      var hooks = ['created', 'beforeCompile', 'compiled', 'attached', 'ready']
      var options = {
        data: {
          test: 'foo'
        }
      }
      hooks.forEach(function (hook) {
        options[hook] = jasmine.createSpy(hook)
      })
      var vm = new Vue(options)
      expect(options.created).toHaveBeenCalled()
      expect(options.beforeCompile).not.toHaveBeenCalled()
      vm.$mount(el)
      expect(options.beforeCompile).toHaveBeenCalled()
      expect(options.compiled).toHaveBeenCalled()
      expect(options.attached).not.toHaveBeenCalled()
      expect(options.ready).not.toHaveBeenCalled()
      vm.$appendTo(document.body)
      expect(options.attached).toHaveBeenCalled()
      expect(options.ready).toHaveBeenCalled()
      vm.$remove()
    })

    it('warn against multiple calls', function () {
      var vm = new Vue({
        el: el
      })
      vm.$mount(el)
      expect(_.warn.msg).toContain('$mount() should be called only once')
    })
  })

  describe('$destroy', function () {
    it('normal', function () {
      var vm = new Vue()
      expect(vm._isDestroyed).toBe(false)
      vm.$destroy()
      expect(vm._isDestroyed).toBe(true)
      expect(vm.$el).toBe(null)
      expect(vm.$parent).toBe(null)
      expect(vm.$root).toBe(null)
      expect(vm._directives).toBe(null)
      expect(Object.keys(vm._events).length).toBe(0)
    })

    it('remove element', function () {
      var el = document.createElement('div')
      var parent = document.createElement('div')
      parent.appendChild(el)
      var vm = new Vue({ el: el })
      vm.$destroy(true)
      expect(parent.childNodes.length).toBe(0)
      expect(el.__vue__).toBe(null)
    })

    it('hooks', function () {
      var opts = {
        beforeDestroy: jasmine.createSpy(),
        destroyed: jasmine.createSpy(),
        detached: jasmine.createSpy()
      }
      var el = opts.el = document.createElement('div')
      document.body.appendChild(el)
      var vm = new Vue(opts)
      vm.$destroy(true)
      expect(opts.beforeDestroy).toHaveBeenCalled()
      expect(opts.destroyed).toHaveBeenCalled()
      expect(opts.detached).toHaveBeenCalled()
    })

    it('directives', function () {
      var spy = jasmine.createSpy('directive unbind')
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
      expect(spy).toHaveBeenCalled()
    })

    it('refuse multiple calls', function () {
      var spy = jasmine.createSpy()
      var vm = new Vue({
        beforeDestroy: spy
      })
      vm.$destroy()
      vm.$destroy()
      expect(spy.calls.count()).toBe(1)
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
      expect(vm._directives.length).toBe(1)
      var partial = document.createElement('span')
      textContent(partial, '{{a}}')
      var decompile = vm.$compile(partial)
      expect(textContent(partial)).toBe('foo')
      expect(vm._directives.length).toBe(2)
      decompile()
      expect(vm._directives.length).toBe(1)
    })
  })
})
