var Braces = require('src')
var def = require('src/directives/public/show')

describe('v-show', function () {
  var el
  beforeEach(function () {
    el = document.createElement('div')
    document.body.appendChild(el)
  })

  afterEach(function () {
    document.body.removeChild(el)
  })

  it('should work', function () {
    var dir = {
      el: el,
      update: def.update,
      apply: def.apply,
      vm: new Braces()
    }
    dir.update(false)
    expect(el.style.display).toBe('none')
    dir.update(true)
    expect(el.style.display).toBe('')
  })

  it('should work with v-else', function () {
    el.innerHTML = '<p v-show="ok">YES</p><p v-else>NO</p>'
    new Braces({
      el: el,
      data: {
        ok: true
      }
    })
    expect(el.children[0].style.display).toBe('')
    expect(el.children[1].style.display).toBe('none')

    var el1 = document.createElement('div')
    el1.innerHTML = '<p v-show="ok">YES</p><p v-else>NO</p>'
    new Braces({
      el: el1,
      data: {
        ok: false
      }
    })
    expect(el1.children[0].style.display).toBe('none')
    expect(el1.children[1].style.display).toBe('')
  })
})
