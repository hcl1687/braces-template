// test cases for edge cases & bug fixes
import Vue from 'src'

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

  it('handle interpolated textarea', function () {
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

  // #2500
  it('template parser tag match should include hyphen', function () {
    var el = document.createElement('div')
    el.innerHTML = '<div>{{{ test }}}</div>'
    var vm = new Vue({
      el: el,
      data: {
        test: '<image-field></image-field>'
      }
    })
    expect(vm.$el.querySelector('image-field').namespaceURI).to.not.include('svg')
  })

  // #2657
  it('template v-for with v-if', function () {
    var el = document.createElement('div')
    el.innerHTML = '<div><div v-for="n in 6" v-if="n % 2">{{ n }}</div></div>'
    var vm = new Vue({
      el: el
    })
    expect(vm.$el.textContent).to.equal('135')
  })
})
