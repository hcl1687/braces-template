var Vue = require('src')

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
    expect(vm.$els.testEl.id).to.equal('test')
  })

  it('aside v-if', function () {
    el.innerHTML = '<div v-if="ok" v-el:test-el id="test"></div>'
    var vm = new Vue({
      el: el,
      data: {
        ok: false
      }
    })
    expect(vm.$els.testEl).to.equal(undefined)
  })

  it('inside v-for', function () {
    el.innerHTML = '<div v-for="n in items"><p v-el:test>{{n}}</p>{{$els.test.textContent}}</div>'
    var vm = new Vue({
      el: el,
      data: { items: [1, 2] }
    })
    expect(vm.$el.textContent).to.equal('1122')
  })
})
