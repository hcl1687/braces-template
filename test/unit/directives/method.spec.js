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
    _.innerHTML(el, '<div type="text/x-template" v-method:a.literal="test">this.b = a</div><a @click="test(1)"></a>')
    var vm = new Braces({
      el: el
    })
    var a = el.lastChild
    trigger(a, 'click')
    expect(vm.b).toBe(1)
  })

  it('method with dynamic name', function () {
    _.innerHTML(el, '<div type="text/x-template" v-method:a="funName">this.b = a</div><a @click="test(1)"></a>')
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

  it('method with object scope', function () {
    _.innerHTML(el, '<div type="text/x-template" v-method:a="funName">this.b = a + this.c</div><a @click="test(1)"></a>')
    var scope = {
      c: 1
    }
    new Braces({
      el: el,
      data: {
        funName: 'test'
      },
      directives: {
        method: {
          scope: scope
        }
      }
    })
    var a = el.lastChild
    trigger(a, 'click')
    expect(scope.b).toBe(2)
  })

  it('method with function scope', function () {
    _.innerHTML(el, '<div type="text/x-template" v-method:a="funName">return this.name</div><div>{{test()}}</div>')
    new Braces({
      el: el,
      data: {
        funName: 'test',
        message: 'hello'
      },
      directives: {
        method: {
          scope: function () {
            return {
              name: this.message
            }
          }
        }
      }
    })
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<div>hello</div>')
  })

  it('method with multi arguments', function () {
    var html = ''
    html += '<div type="text/x-template" v-method:name,u-id.literal="test">'
    html += 'return name + uId'
    html += '</div>'
    html += '<div>{{test("hcl", "1687")}}</div>'
    el.innerHTML = html
    new Braces({
      el: el
    })
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<div>hcl1687</div>')
  })

  it('method with no arguments', function () {
    var html = ''
    html += '<div type="text/x-template" v-method.literal="test">'
    html += 'return 123'
    html += '</div>'
    html += '<div>{{test()}}</div>'
    el.innerHTML = html
    new Braces({
      el: el
    })
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<div>123</div>')
  })
})
