var _ = require('src/util')
var Braces = require('src')

function trigger (target, event, process) {
  var e
  if (_.isIE8) {
    e = document.createEventObject()
    if (event === 'click') {
      e.button = 1
    }
    if (process) process(e)
    target.fireEvent('on' + event, e)
    return e
  }
  e = document.createEvent('HTMLEvents')
  e.initEvent(event, true, true)
  if (process) process(e)
  target.dispatchEvent(e)
  return e
}

describe('v-method', function () {
  var el
  beforeEach(function () {
    el = document.createElement('div')
  })

  it('method with literal name', function () {
    _.innerHTML(el, '<script type="x/template" v-method:a.literal="test">this.b = a</script><a @click="test(1)"></a>')
    var vm = new Braces({
      el: el
    })
    var a = el.lastChild
    trigger(a, 'click')
    expect(vm.b).toBe(1)
  })

  it('method with dynamic name', function () {
    _.innerHTML(el, '<script type="x/template" v-method:a="funName">this.b = a</script><a @click="test(1)"></a>')
    var vm = new Braces({
      el: el,
      data: {
        funName: 'test'
      }
    })
    var a = el.lastChild
    trigger(a, 'click')
    expect(vm.b).toBe(1)
  })
})
