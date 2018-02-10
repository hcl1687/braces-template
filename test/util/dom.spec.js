var _ = require('src/util')

describe('Util - DOM', function () {
  var parent, child, target

  function div () {
    return document.createElement('div')
  }

  beforeEach(function () {
    parent = div()
    child = div()
    target = div()
    parent.appendChild(child)
  })

  it('inDoc', function () {
    expect(_.inDoc(target)).to.equal(false)
    document.body.appendChild(target)
    expect(_.inDoc(target)).to.equal(true)
    document.body.removeChild(target)
    expect(_.inDoc(target)).to.equal(false)
  })

  it('inDoc (iframe)', function (done) {
    var f = document.createElement('iframe')
    f.onload = function () {
      f.contentWindow.document.body.appendChild(target)
      expect(_.inDoc(target)).to.equal(true)
      document.body.removeChild(f)
      done()
    }
    document.body.appendChild(f)
    f.src = 'about:blank'
  })

  it('getAttr', function () {
    target.setAttribute('v-test', 'ok')
    var val = _.getAttr(target, 'v-test')
    expect(val).to.equal('ok')
    expect(target.hasAttribute('v-test')).to.equal(false)
  })

  it('before', function () {
    _.before(target, child)
    expect(target.parentNode).to.equal(parent)
    expect(target.nextSibling).to.equal(child)
  })

  it('after', function () {
    _.after(target, child)
    expect(target.parentNode).to.equal(parent)
    expect(child.nextSibling).to.equal(target)
  })

  it('after with sibling', function () {
    var sibling = div()
    parent.appendChild(sibling)
    _.after(target, child)
    expect(target.parentNode).to.equal(parent)
    expect(child.nextSibling).to.equal(target)
  })

  it('remove', function () {
    _.remove(child)
    expect(child.parentNode).to.equal(null)
    expect(parent.childNodes.length).to.equal(0)
  })

  it('prepend', function () {
    _.prepend(target, parent)
    expect(target.parentNode).to.equal(parent)
    expect(parent.firstChild).to.equal(target)
  })

  it('prepend to empty node', function () {
    parent.removeChild(child)
    _.prepend(target, parent)
    expect(target.parentNode).to.equal(parent)
    expect(parent.firstChild).to.equal(target)
  })

  it('replace', function () {
    _.replace(child, target)
    expect(parent.childNodes.length).to.equal(1)
    expect(parent.firstChild).to.equal(target)
  })

  it('on/off', function () {
    // IE requires element to be in document to fire events
    document.body.appendChild(target)
    var spy = sinon.spy()
    _.on(target, 'click', spy)
    var e = document.createEvent('HTMLEvents')
    e.initEvent('click', true, true)
    target.dispatchEvent(e)
    expect(spy.callCount).to.equal(1)
    expect(spy.calledWith(e)).to.equal(true)
    _.off(target, 'click', spy)
    target.dispatchEvent(e)
    expect(spy.callCount).to.equal(1)
    document.body.removeChild(target)
  })

  it('addClass/removeClass', function () {
    var el = document.createElement('div')
    el.className = 'aa bb cc'
    _.removeClass(el, 'bb')
    expect(el.className).to.equal('aa cc')
    _.removeClass(el, 'aa')
    expect(el.className).to.equal('cc')
    _.addClass(el, 'bb')
    expect(el.className).to.equal('cc bb')
    _.addClass(el, 'bb')
    expect(el.className).to.equal('cc bb')
  })

  it('addClass/removeClass for SVG/IE9', function () {
    var el = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    el.setAttribute('class', 'aa bb cc')
    _.removeClass(el, 'bb')
    expect(el.getAttribute('class')).to.equal('aa cc')
    _.removeClass(el, 'aa')
    expect(el.getAttribute('class')).to.equal('cc')
    _.addClass(el, 'bb')
    expect(el.getAttribute('class')).to.equal('cc bb')
    _.addClass(el, 'bb')
    expect(el.getAttribute('class')).to.equal('cc bb')
  })

  it('getOuterHTML for SVG', function () {
    var el = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    el.setAttribute('class', 'aa bb cc')
    var html = _.getOuterHTML(el)
    var re = /<circle (xmlns="http:\/\/www\.w3\.org\/2000\/svg"\s)?class="aa bb cc"(\s?\/>|><\/circle>)/
    expect(re.test(html)).to.equal(true)
  })
})
