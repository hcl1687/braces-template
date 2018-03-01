var _ = require('src/util')
var Vue = require('src')
var textContent = _.textContent

describe('el', function () {
  var el
  beforeEach(function () {
    el = document.createElement('div')
  })

  it('normal', function () {
    el.innerHTML = '<div v-if="ok" v-el:test-el id="test"></div>'
    var vm = new Vue({
      el: el,
      data: {
        ok: true
      }
    })
    expect(vm.$els.testEl.id).toBe('test')
  })

  it('aside v-if', function () {
    el.innerHTML = '<div v-if="ok" v-el:test-el id="test"></div>'
    var vm = new Vue({
      el: el,
      data: {
        ok: false
      }
    })
    expect(vm.$els.testEl).toBe(undefined)
  })

  it('inside v-for', function () {
    el.innerHTML = '<div v-for="n in items"><p v-el:test>{{n}}</p>{{textContent($els.test)}}</div>'
    var vm = new Vue({
      el: el,
      data: { items: [1, 2] },
      methods: {
        textContent: textContent
      }
    })
    expect(textContent(vm.$el).replace(/\r\n/g, '')).toBe('1122')
  })
})
