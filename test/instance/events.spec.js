var Braces = require('src')
var _ = require('src/util')
var textContent = _.textContent

describe('Instance Events', function () {
  var spy, spy2
  beforeEach(function () {
    spy = jasmine.createSpy()
    spy2 = jasmine.createSpy()
  })

  describe('option events', function () {
    it('normal events', function () {
      var vm = new Braces({
        events: {
          test: spy,
          test2: [spy, spy]
        }
      })
      vm.$emit('test', 123)
      expect(spy).toHaveBeenCalledWith(123)
      vm.$emit('test2')
      expect(spy.calls.count()).toBe(3)
    })

    it('hook events', function () {
      new Braces({
        events: {
          'hook:created': spy
        }
      })
      expect(spy).toHaveBeenCalled()
    })

    it('method name strings', function () {
      var vm = new Braces({
        events: {
          test: 'doSomething',
          test2: 'doSomethingElse'
        },
        methods: {
          doSomething: spy
        }
      })
      vm.$emit('test', 123)
      expect(spy).toHaveBeenCalledWith(123)
      vm.$emit('test2')
      expect(_.warn.msg).toContain('Unknown method')
    })
  })

  describe('hooks', function () {
    it('created', function () {
      var ctx
      var vm = new Braces({
        created: function () {
          // can't assert this === vm here
          // because the constructor hasn't returned yet
          ctx = this
          spy()
        }
      })
      expect(ctx).toBe(vm)
      expect(spy).toHaveBeenCalled()
    })

    it('beforeDestroy', function () {
      var vm = new Braces({
        beforeDestroy: function () {
          expect(this).toBe(vm)
          expect(this._isDestroyed).toBe(false)
          spy()
        }
      })
      vm.$destroy()
      expect(spy).toHaveBeenCalled()
    })

    it('destroyed', function () {
      var vm = new Braces({
        destroyed: function () {
          expect(this).toBe(vm)
          expect(this._isDestroyed).toBe(true)
          spy()
        }
      })
      vm.$destroy()
      expect(spy).toHaveBeenCalled()
    })

    it('beforeCompile', function () {
      var vm = new Braces({
        data: { a: 1 },
        beforeCompile: function () {
          expect(this).toBe(vm)
          expect(this.$el).toBe(el)
          expect(textContent(this.$el)).toBe('{{a}}')
          spy()
        }
      })
      var el = document.createElement('div')
      textContent(el, '{{a}}')
      vm.$mount(el)
      expect(spy).toHaveBeenCalled()
    })

    it('compiled', function () {
      var vm = new Braces({
        data: { a: 1 },
        compiled: function () {
          expect(this.$el).toBe(el)
          expect(textContent(this.$el)).toBe('1')
          spy()
        }
      })
      var el = document.createElement('div')
      textContent(el, '{{a}}')
      vm.$mount(el)
      expect(spy).toHaveBeenCalled()
    })

    it('ready', function () {
      var vm = new Braces({
        ready: spy
      })
      expect(spy).not.toHaveBeenCalled()
      var el = document.createElement('div')
      vm.$mount(el)
      expect(spy).not.toHaveBeenCalled()
      vm.$appendTo(document.body)
      expect(spy).toHaveBeenCalled()
      vm.$remove()
      // try mounting on something already in dom
      el = document.createElement('div')
      document.body.appendChild(el)
      vm = new Braces({
        el: el,
        ready: spy2
      })
      expect(spy2).toHaveBeenCalled()
      vm.$remove()
    })

    describe('attached/detached', function () {
      it('in DOM', function () {
        var el = document.createElement('div')
        document.body.appendChild(el)
        var parentVm = new Braces({
          el: el,
          attached: spy,
          detached: spy2
        })
        expect(spy.calls.count()).toBe(1)
        parentVm.$remove()
        expect(spy2.calls.count()).toBe(1)
      })

      it('create then attach', function () {
        var el = document.createElement('div')
        var parentVm = new Braces({
          el: el,
          attached: spy,
          detached: spy2
        })
        parentVm.$appendTo(document.body)
        expect(spy.calls.count()).toBe(1)
        parentVm.$remove()
        expect(spy2.calls.count()).toBe(1)
      })
    })
  })
})
