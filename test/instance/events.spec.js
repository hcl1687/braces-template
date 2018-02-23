var Vue = require('src')
var _ = require('src/util')

describe('Instance Events', function () {
  var spy, spy2
  beforeEach(function () {
    spy = sinon.spy()
    spy2 = sinon.spy()
  })

  describe('option events', function () {
    it('normal events', function () {
      var vm = new Vue({
        events: {
          test: spy,
          test2: [spy, spy]
        }
      })
      vm.$emit('test', 123)
      expect(spy.calledWith(123)).to.equal(true)
      vm.$emit('test2')
      expect(spy.callCount).to.equal(3)
    })

    it('hook events', function () {
      new Vue({
        events: {
          'hook:created': spy
        }
      })
      expect(spy.called).to.equal(true)
    })

    it('method name strings', function () {
      var vm = new Vue({
        events: {
          test: 'doSomething',
          test2: 'doSomethingElse'
        },
        methods: {
          doSomething: spy
        }
      })
      vm.$emit('test', 123)
      expect(spy.calledWith(123)).to.equal(true)
      vm.$emit('test2')
      expect(_.warn.msg).to.includes('Unknown method')
    })
  })

  describe('hooks', function () {
    it('created', function () {
      var ctx
      var vm = new Vue({
        created: function () {
          // can't assert this === vm here
          // because the constructor hasn't returned yet
          ctx = this
          spy()
        }
      })
      expect(ctx).to.equal(vm)
      expect(spy.called).to.equal(true)
    })

    it('beforeDestroy', function () {
      var vm = new Vue({
        beforeDestroy: function () {
          expect(this).to.equal(vm)
          expect(this._isDestroyed).to.equal(false)
          spy()
        }
      })
      vm.$destroy()
      expect(spy.called).to.equal(true)
    })

    it('destroyed', function () {
      var vm = new Vue({
        destroyed: function () {
          expect(this).to.equal(vm)
          expect(this._isDestroyed).to.equal(true)
          spy()
        }
      })
      vm.$destroy()
      expect(spy.called).to.equal(true)
    })

    it('beforeCompile', function () {
      var vm = new Vue({
        data: { a: 1 },
        beforeCompile: function () {
          expect(this).to.equal(vm)
          expect(this.$el).to.equal(el)
          expect(this.$el.textContent).to.equal('{{a}}')
          spy()
        }
      })
      var el = document.createElement('div')
      el.textContent = '{{a}}'
      vm.$mount(el)
      expect(spy.called).to.equal(true)
    })

    it('compiled', function () {
      var vm = new Vue({
        data: { a: 1 },
        compiled: function () {
          expect(this.$el).to.equal(el)
          expect(this.$el.textContent).to.equal('1')
          spy()
        }
      })
      var el = document.createElement('div')
      el.textContent = '{{a}}'
      vm.$mount(el)
      expect(spy.called).to.equal(true)
    })

    it('ready', function () {
      var vm = new Vue({
        ready: spy
      })
      expect(spy.called).not.to.equal(true)
      var el = document.createElement('div')
      vm.$mount(el)
      expect(spy.called).not.to.equal(true)
      vm.$appendTo(document.body)
      expect(spy.called).to.equal(true)
      vm.$remove()
      // try mounting on something already in dom
      el = document.createElement('div')
      document.body.appendChild(el)
        vm = new Vue({
        el: el,
        ready: spy2
      })
      expect(spy2.called).to.equal(true)
      vm.$remove()
    })

    describe('attached/detached', function () {
      it('in DOM', function () {
        var el = document.createElement('div')
        document.body.appendChild(el)
        var parentVm = new Vue({
          el: el,
          attached: spy,
          detached: spy2
        })
        expect(spy.callCount).to.equal(1)
        parentVm.$remove()
        expect(spy2.callCount).to.equal(1)
      })

      it('create then attach', function () {
        var el = document.createElement('div')
        var parentVm = new Vue({
          el: el,
          attached: spy,
          detached: spy2
        })
        parentVm.$appendTo(document.body)
        expect(spy.callCount).to.equal(1)
        parentVm.$remove()
        expect(spy2.callCount).to.equal(1)
      })
    })
  })
})
