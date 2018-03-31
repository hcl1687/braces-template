var _ = require('src/util')
var Braces = require('src')

describe('v-source', function () {
  var el
  beforeEach(function () {
    el = document.createElement('div')
  })

  it('source is plain object data', function () {
    var str = ''
    str += '<div type="text/x-template" v-source="test"><div>{{a}}</div></div>'
    _.innerHTML(el, str)
    new Braces({
      el: el,
      data: {
        test: {
          a: 1,
          b: 2
        }
      }
    })
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<div>1</div>')
  })

  it('source is function return plain object data', function () {
    var str = ''
    str += '<div type="text/x-template" v-method:a.literal="test">return { a: 1, b: 2}</div>'
    str += '<div type="text/x-template" v-source="test"><div>{{a}}</div></div>'
    _.innerHTML(el, str)
    new Braces({
      el: el
    })
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<div>1</div>')
  })

  it('source is promise data', function (done) {
    var str = ''
    str += '<div type="text/x-template" v-source="test"><div>{{a}}</div></div>'
    _.innerHTML(el, str)
    new Braces({
      el: el,
      data: {
        test: Promise.resolve({ a: 1 })
      }
    })

    setTimeout(function () {
      expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<div>1</div>')
      done()
    }, 50)
  })

  it('source is function return promise', function (done) {
    var html = ''
    html += '<div type="text/x-template" v-source="test"><div>{{a}}</div></div>'
    el.innerHTML = html
    new Braces({
      el: el,
      methods: {
        test: function () {
          return new Promise(function (resolve) {
            setTimeout(function () {
              resolve({ a: 1 })
            }, 500)
          })
        }
      }
    })

    setTimeout(function () {
      expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<div>1</div>')
      done()
    }, 1000)
  })

  it('hook attached and detached', function (done) {
    var str = ''
    str += '<div type="text/x-template" v-source="test" :attached="attached" :detached="detached"><div>{{a}}</div></div>'
    _.innerHTML(el, str)
    document.body.appendChild(el)

    var attached = jasmine.createSpy('attached')
    var detached = jasmine.createSpy('detached')
    var vm = new Braces({
      el: el,
      methods: {
        test: function () {
          return new Promise(function (resolve) {
            setTimeout(function () {
              resolve({ a: 1 })
            }, 50)
          })
        },
        attached: attached,
        detached: detached
      }
    })

    setTimeout(function () {
      expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<div>1</div>')
      expect(attached).toHaveBeenCalled()
      setTimeout(function () {
        vm.$destroy(true)
        expect(detached).toHaveBeenCalled()

        done()
      }, 100)
    }, 100)
  })
})
