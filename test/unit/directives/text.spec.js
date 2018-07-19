var _ = require('src/util')
var def = require('src/directives/public/text')
var textContent = _.textContent

describe('v-text', function () {
  it('element', function () {
    var dir = {
      el: document.createElement('div')
    }
    _.extend(dir, def)
    dir.bind()
    dir.update('foo')
    expect(textContent(dir.el)).toBe('foo')
    dir.update(123)
    expect(textContent(dir.el)).toBe('123')
  })

  it('text node', function () {
    var dir = {
      el: document.createTextNode(' ')
    }
    _.extend(dir, def)
    dir.bind()
    dir.update('foo')
    expect(dir.el.nodeValue).toBe('foo')
    dir.update(123)
    expect(dir.el.nodeValue).toBe('123')
  })
})
