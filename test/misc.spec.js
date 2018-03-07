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

  it('demo: new', function () {
    // el = '<div id="app"><div>{{message}}</div></div>'
    var el = document.createElement('div')
    el.id = 'app'
    el.innerHTML = '<div>{{message}}</div>'
    document.body.appendChild(el)

    var vm = new Braces({
      el: '#app',
      data: {
        message: 'Hello World'
      }
    })

    // output:
    // <div id="app"><div>Hello World</div></div>
    expect(textContent(vm.$el).replace(/\r\n/g, '')).toBe('Hello World')
    el.parentNode.removeChild(el)
  })

  it('demo: new with template', function () {
    var el = document.createElement('div')
    el.id = 'app'
    document.body.appendChild(el)

    var vm = new Braces({
      el: '#app',
      template: '<div>{{ message }}</div>',
      data: {
        message: 'Hello World'
      }
    })

    // output:
    // <div id="app"><div>Hello World</div></div>
    expect(textContent(vm.$el).replace(/\r\n/g, '')).toBe('Hello World')
    el.parentNode.removeChild(el)
  })

  it('demo: v-for', function () {
    var el = document.createElement('div')
    el.id = 'app'
    document.body.appendChild(el)

    new Braces({
      el: el,
      template: '<div v-for="item in items">{{$index}} {{item.a}}</div>',
      data: {
        items: [{a: 1}, {a: 2}]
      }
    })

    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<div>0 1</div><div>1 2</div>')
    el.parentNode.removeChild(el)
  })

  // it('demo: v-for nested', function () {
  //   debugger
  //   var el = document.createElement('div')
  //   el.id = 'app'
  //   document.body.appendChild(el)

  //   new Braces({
  //     el: el,
  //     template: '<script type="x/template" v-for="item in items">' +
  //         '<p v-for="subItem in item.items">{{$index}} {{subItem.a}} {{$parent.$index}} {{item.a}}</p>' +
  //       '</script>',
  //     data: {
  //       items: [
  //         { items: [{a: 1}, {a: 2}], a: 1 },
  //         { items: [{a: 3}, {a: 4}], a: 2 }
  //       ]
  //     }
  //   })

  //   expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe(
  //     '<p>0 1 0 1</p><p>1 2 0 1</p>' +
  //     '<p>0 3 1 2</p><p>1 4 1 2</p>'
  //   )
  //   el.parentNode.removeChild(el)
  // })

  it('demo: v-if false', function () {
    var el = document.createElement('div')
    el.id = 'app'
    document.body.appendChild(el)

    new Braces({
      el: '#app',
      template: '<div v-if="test"><div :a="a"></div></div>',
      data: { test: false, a: 'A' }
    })
    expect(el.innerHTML).toBe('')
    el.parentNode.removeChild(el)
  })

  it('demo: v-if true', function () {
    var el = document.createElement('div')
    el.id = 'app'
    document.body.appendChild(el)

    new Braces({
      el: el,
      template: '<div v-if="test"><div id="a" :a="a"></div></div>',
      data: { test: true, a: 'A' }
    })
    // lazy instantitation
    if (_.isIE8) {
      expect(el.innerHTML.replace(/\r\n/g, '')).toBe('<DIV><DIV id=a a="A"></DIV></DIV>')
    } else {
      expect(el.innerHTML).toBe('<div><div id="a" a="A"></div></div>')
    }
    expect(el.children[0].children[0].getAttribute('a')).toBe('A')
    el.parentNode.removeChild(el)
  })

  it('demo: html', function () {
    var el = document.createElement('div')
    el.id = 'app'
    document.body.appendChild(el)

    new Braces({
      el: '#app',
      template: '<div>{{{ message }}}</div>',
      data: {
        message: '<div>1234</div><p>234</p>'
      }
    })
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<div><div>1234</div><p>234</p></div>')
    el.parentNode.removeChild(el)
  })
})
