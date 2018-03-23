var _ = require('src/util')
var Braces = require('src')

describe('v-source', function () {
  var el
  beforeEach(function () {
    el = document.createElement('div')
  })

  it('source is plain object data', function () {
    var str = ''
    str += '<script type="x/template" v-source="test"><div>{{a}}</div></script>'
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
    str += '<script type="x/template" v-method:a.literal="test">return { a: 1, b: 2}</script>'
    str += '<script type="x/template" v-source="test"><div>{{a}}</div></script>'
    _.innerHTML(el, str)
    new Braces({
      el: el
    })
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<div>1</div>')
  })

  it('source is promise data', function (done) {
    var str = ''
    str += '<script type="x/template" v-source="test"><div>{{a}}</div></script>'
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
    var str = ''
    str += '<script type="x/template" v-source="test"><div>{{a}}</div></script>'
    _.innerHTML(el, str)
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
})
