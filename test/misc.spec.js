// test cases for edge cases & bug fixes
import Vue from 'src'
var _ = Vue.util

describe('Misc', function () {
  it('should handle directive.bind() altering its childNode structure', function () {
    var div = document.createElement('div')
    div.innerHTML = '<div v-test>{{test}}</div>'
    var vm = new Vue({
      el: div,
      data: {
        test: 'foo'
      },
      directives: {
        test: {
          bind: function () {
            this.el.insertBefore(document.createTextNode('bar '),
              this.el.firstChild)
          }
        }
      }
    })
    expect(vm.$el.textContent).to.equal('bar foo')
  })

  // #922
  it('template v-for inside svg', function () {
    var el = document.createElement('div')
    el.innerHTML = '<svg><template v-for="n in list"><text>{{n}}</text></template></svg>'
    new Vue({
      el: el,
      data: {
        list: [1, 2, 3]
      }
    })
    // IE inlines svg namespace
    var xmlns = /\s?xmlns=".*svg"/
    expect(el.innerHTML.replace(xmlns, '')).to.equal('<svg><text>1</text><text>2</text><text>3</text></svg>')
  })

  it('handle interpolated textarea', function (done) {
    var el = document.createElement('div')
    el.innerHTML = '<textarea>hello {{msg}}</textarea>'
    var vm = new Vue({
      el: el,
      data: {
        msg: 'test'
      }
    })
    expect(el.innerHTML).to.equal('<textarea>hello test</textarea>')
  })

  it('prefer bound attributes over static attributes', () => {
    var el = document.createElement('div')
    el.id = 'test'
    el.innerHTML += '<div v-bind:title="title"></div>'
    el.innerHTML += '<div title="static" v-bind:title="title"></div>'
    el.innerHTML += '<div title="static"></div>'
    el.innerHTML += '<div :title="title"></div>'
    el.innerHTML += '<div title="static" :title="title"></div>'
    var expected = [
      'bound',
      'bound',
      'static',
      'bound',
      'bound'
    ]

    new Vue({
      el: el,
      data: {
        title: 'bound'
      }
    })

    var childNodes = el.childNodes
    var ret = true
    for (var i = 0, l = childNodes.length; i < l; i++) {
      var child = childNodes[i]
      if (child.title !== expected[i]) {
        ret = false
      }
    }

    expect(ret).to.be.true
  })

  // #2445
  it('fragment attach hook should check if child is inDoc', function (done) {
    var el = document.createElement('div')
    document.body.appendChild(el)
    var spyParent = jasmine.createSpy('attached parent')
    var spyChild = jasmine.createSpy('attached child')

    new Vue({
      el: el,
      template: '<comp v-for="n in 1"></comp>',
      components: {
        comp: {
          template: '<div><child></child></div>',
          attached: function () {
            expect(_.inDoc(this.$el)).toBe(true)
            spyParent()
          },
          activate: function (next) {
            setTimeout(function () {
              next()
              check()
            }, 100)
          },
          components: {
            child: {
              template: 'foo',
              attached: spyChild
            }
          }
        }
      }
    })

    function check () {
      expect(spyParent).toHaveBeenCalled()
      expect(spyChild).toHaveBeenCalled()
      done()
    }
  })

  // #2500
  it('template parser tag match should include hyphen', function () {
    var vm = new Vue({
      el: document.createElement('div'),
      template: '<div>{{{ test }}}</div>',
      data: {
        test: '<image-field></image-field>'
      }
    })
    expect(vm.$el.querySelector('image-field').namespaceURI).not.toMatch(/svg/)
  })

  // #2657
  it('template v-for with v-if', function () {
    var vm = new Vue({
      el: document.createElement('div'),
      template: '<div><template v-for="n in 6" v-if="n % 2">{{ n }}</template></div>'
    })
    expect(vm.$el.textContent).toBe('135')
  })

  // #2821
  it('batcher should keep flushing until all queues are depleted', function (done) {
    var spy = jasmine.createSpy()
    var vm = new Vue({
      el: document.createElement('div'),
      template: '<test :prop="model"></test>',
      data: {
        model: 0,
        count: 0
      },
      watch: {
        count: function () {
          this.model++
        }
      },
      components: {
        test: {
          props: ['prop'],
          watch: {
            prop: spy
          }
        }
      }
    })
    vm.count++
    Vue.nextTick(function () {
      expect(spy).toHaveBeenCalled()
      done()
    })
  })
})
