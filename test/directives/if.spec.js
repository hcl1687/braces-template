var _ = require('src/util')
var Vue = require('src')
var textContent = _.textContent

describe('v-if', function () {
  var el
  beforeEach(function () {
    el = document.createElement('div')
  })

  it('normal-false', function () {
    el.innerHTML = '<div v-if="test"><div :a="a"></div></div>'
    var vm = new Vue({
      el: el,
      data: { test: false, a: 'A' }
    })
    expect(el.innerHTML).toBe('')
  })

  it('normal-true', function () {
    el.innerHTML = '<div v-if="test"><div id="a" :a="a"></div></div>'
    var vm = new Vue({
      el: el,
      data: { test: true, a: 'A' }
    })
    // lazy instantitation
    if (_.isIE8) {
      expect(el.innerHTML.replace(/\r\n/g, '')).toBe('<DIV><DIV id=a a="A"></DIV></DIV>')
    } else {
      expect(el.innerHTML).toBe('<div><div id="a" a="A"></div></div>')
    }
    expect(el.children[0].children[0].getAttribute('a')).toBe('A')
  })

  it('v-if with different truthy values', function () {
    el.innerHTML = '<div v-if="a">{{a}}</div>'
    var vm = new Vue({
      el: el,
      data: {
        a: 1
      }
    })
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<div>1</div>')
  })

  it('invalid warn', function () {
    el.setAttribute('v-if', 'test')
    new Vue({
      el: el
    })
    expect(_.warn.msg).toContain('cannot be used on an instance root element')
  })

  it('if + else', function () {
    el.innerHTML = '<div v-if="test">{{a}}</div><div v-else>{{b}}</div>'
    var vm = new Vue({
      el: el,
      data: { test: false, a: 'A', b: 'B' }
    })
    expect(textContent(el)).toBe('B')

    var el1 = document.createElement('div')
    el1.innerHTML = '<div v-if="test">{{a}}</div><div v-else>{{b}}</div>'
    vm = new Vue({
      el: el1,
      data: { test: true, a: 'A', b: 'B' }
    })
    expect(textContent(el1)).toBe('A')
  })
})
