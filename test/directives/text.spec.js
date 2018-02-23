var _ = require('src/util')
var def = require('src/directives/public/text')

describe('v-text', function () {
  it('element', function () {
    var dir = {
      el: document.createElement('div')
    }
    _.extend(dir, def)
    dir.bind()
    dir.update('foo')
    expect(dir.el.textContent).to.equal('foo')
    dir.update(123)
    expect(dir.el.textContent).to.equal('123')
  })

  it('text node', function () {
    var dir = {
      el: document.createTextNode(' ')
    }
    _.extend(dir, def)
    dir.bind()
    dir.update('foo')
    expect(dir.el.nodeValue).to.equal('foo')
    dir.update(123)
    expect(dir.el.nodeValue).to.equal('123')
  })
})
