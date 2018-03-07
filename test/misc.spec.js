// test cases for edge cases & bug fixes
var  Braces = require('src')
var _ = require('src/util')
var textContent = _.textContent

describe('Misc', function () {
  it('should handle directive.bind() altering its childNode structure', function () {
    var div = document.createElement('div')
    var vm = new Braces({
      el: div,
      template: '<div v-test>{{test}}</div>',
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
    expect(textContent(vm.$el)).toBe('bar foo')
  })

  // #922
  it('v-for inside svg', function () {
    var el = document.createElement('div')
    var svg = document.createElement('svg')
    svg.innerHTML = '<g v-for="n in list"><text>{{n}}</text></g>'
    el.appendChild(svg)
    new Braces({
      el: el,
      data: {
        list: [1, 2, 3]
      }
    })
    // IE inlines svg namespace
    if (_.isIE8) {
      expect(_.warn.msg).toContain('Do not use SVG tag. IE8 doesn\'t support SVG.')
    } else {
      var xmlns = /\s?xmlns=".*svg"/
      expect(el.innerHTML.replace(xmlns, '')).toBe('<svg><g><text>1</text></g><g><text>2</text></g><g><text>3</text></g></svg>')
    }
  })

  it('handle interpolated textarea', function () {
    var el = document.createElement('div')
    el.innerHTML = '<textarea>hello {{msg}}</textarea>'
    var vm = new Braces({
      el: el,
      data: {
        msg: 'test'
      }
    })
    expect(el.innerHTML.toLowerCase()).toBe('<textarea>hello test</textarea>')
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

    new Braces({
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

    expect(ret).toBe(true)
  })

  // #2657
  it('template v-for with v-if', function () {
    var el = document.createElement('div')
    el.innerHTML = '<div><div v-for="n in 6" v-if="n % 2">{{ n }}</div></div>'
    var vm = new Braces({
      el: el
    })
    expect(textContent(vm.$el).replace(/\r\n/g, '')).toBe('135')
  })
})
