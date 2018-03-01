var _ = require('src/util')
var def = require('src/directives/public/html')

describe('v-html', function () {
  var el
  beforeEach(function () {
    el = document.createElement('div')
  })

  it('element', function () {
    var dir = {
      el: el
    }
    _.extend(dir, def)
    dir.bind()
    dir.update('<div>1234</div><p>234</p>')
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<div>1234</div><p>234</p>')
    dir.update('<p>123</p><div>444</div>')
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<p>123</p><div>444</div>')
    dir.update(null)
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('')
  })

  it('inline', function () {
    var node = document.createComment('html-test')
    el.appendChild(node)
    var dir = {
      el: node
    }
    _.extend(dir, def)
    dir.bind()
    dir.update('<div>1234</div><p>234</p>')
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<div>1234</div><p>234</p>')
    dir.update('<p>123</p><div>444</div>')
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<p>123</p><div>444</div>')
    dir.update(null)
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('')
  })

  it('inline keep whitespace', function () {
    var node = document.createComment('html-test')
    el.appendChild(node)
    var dir = {
      el: node
    }
    _.extend(dir, def)
    dir.bind()
    dir.update('    <p>span</p>    ')
    if (_.isIE8) {
      expect(el.innerHTML.toLowerCase()).toBe('<p>span</p>')
    } else {
      expect(el.innerHTML).toBe('    <p>span</p>    ')
    }
  })
})
