var _ = require('src/util')
var def = require('src/directives/public/bind')
var xlinkNS = 'http://www.w3.org/1999/xlink'

describe('v-bind', function () {
  var el, dir
  beforeEach(function () {
    el = document.createElement('div')
    dir = {
      el: el,
      descriptor: {},
      modifiers: {}
    }
    _.extend(dir, def)
  })

  it('normal attr', function () {
    dir.arg = 'test'
    dir.update('ok')
    expect(el.getAttribute('test')).to.equal('ok')
    dir.update('again')
    expect(el.getAttribute('test')).to.equal('again')
    dir.update(null)
    expect(el.hasAttribute('test')).to.equal(false)
    dir.update(false)
    expect(el.hasAttribute('test')).to.equal(false)
    dir.update(true)
    expect(el.getAttribute('test')).to.equal('')
    dir.update(0)
    expect(el.getAttribute('test')).to.equal('0')
  })

  it('should set property for input value', function () {
    dir.el = document.createElement('input')
    dir.arg = 'value'
    dir.update('foo')
    expect(dir.el.value).to.equal('foo')
    dir.el = document.createElement('input')
    dir.el.type = 'checkbox'
    dir.arg = 'checked'
    expect(dir.el.checked).to.equal(false)
    dir.update(true)
    expect(dir.el.checked).to.equal(true)
  })

  it('xlink', function () {
    dir.arg = 'xlink:special'
    dir.update('ok')
    expect(el.getAttributeNS(xlinkNS, 'special')).to.equal('ok')
    dir.update('again')
    expect(el.getAttributeNS(xlinkNS, 'special')).to.equal('again')
    dir.update(null)
    expect(el.hasAttributeNS(xlinkNS, 'special')).to.equal(false)
  })

  it('camel modifier', function () {
    dir.modifiers.camel = true
    var div = document.createElement('div')
    div.innerHTML = '<svg></svg>'
    dir.el = div.children[0]
    dir.arg = 'view-box'
    dir.update('0 0 1500 1000')
    expect(dir.el.getAttribute('viewBox')).to.equal('0 0 1500 1000')
  })

  it('enumrated non-boolean attributes', function () {
    ['draggable', 'contenteditable', 'spellcheck'].forEach(function (attr) {
      dir.arg = attr
      dir.update(true)
      expect(el.getAttribute(attr)).to.equal('true')
      dir.update(false)
      expect(el.getAttribute(attr)).to.equal('false')
    })
  })
})
