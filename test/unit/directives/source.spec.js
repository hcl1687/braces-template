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

  it('async ready ', function (done) {
    var str = ''
    str += '<div type="text/x-template" v-source="test"><div>{{a}}</div></div>'
    _.innerHTML(el, str)
    document.body.appendChild(el)

    var ready = jasmine.createSpy('ready')
    var vm = new Braces({
      el: el,
      methods: {
        test: function () {
          var that = this
          return new Promise(function (resolve) {
            setTimeout(function () {
              expect(that._vsourcePending).toBe(1)
              expect(ready.calls.count()).toBe(0)
              resolve({ a: 1 })
            }, 50)
          })
        }
      },
      ready: ready
    })

    expect(vm._vsourcePending).toBe(1)
    expect(ready.calls.count()).toBe(0)

    setTimeout(function () {
      expect(vm._vsourcePending).toBe(0)
      expect(ready.calls.count()).toBe(1)

      done()
    }, 100)
  })

  it('nested async ready ', function (done) {
    var str = ''
    str += '<div type="text/x-template" v-source="test">'
    str += '<div>{{a}}</div>'
    str += '<div type="text/x-template" v-source="test1">'
    str += '<div>{{b}}</div>'
    str += '</div>'
    str += '</div>'
    _.innerHTML(el, str)
    document.body.appendChild(el)

    var ready = jasmine.createSpy('ready')
    var vm = new Braces({
      el: el,
      methods: {
        test: function () {
          var that = this
          return new Promise(function (resolve) {
            setTimeout(function () {
              expect(that._vsourcePending).toBe(1)
              expect(ready.calls.count()).toBe(0)
              resolve({ a: 1 })
            }, 50)
          })
        },
        test1: function () {
          var that = this
          return new Promise(function (resolve) {
            setTimeout(function () {
              expect(that._vsourcePending).toBe(1)
              expect(ready.calls.count()).toBe(0)
              resolve({ b: 2 })
            }, 50)
          })
        }
      },
      ready: ready
    })

    expect(vm._vsourcePending).toBe(1)
    expect(ready.calls.count()).toBe(0)

    setTimeout(function () {
      expect(vm._vsourcePending).toBe(0)
      expect(ready.calls.count()).toBe(1)
      expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<div>1</div><div>2</div>')
      done()
    }, 200)
  })

  it('parallel async ready ', function (done) {
    var str = ''
    str += '<div type="text/x-template" v-source="test">'
    str += '<div>{{a}}</div>'
    str += '</div>'
    str += '<div type="text/x-template" v-source="test1">'
    str += '<div>{{b}}</div>'
    str += '</div>'
    _.innerHTML(el, str)
    document.body.appendChild(el)

    var ready = jasmine.createSpy('ready')
    var vm = new Braces({
      el: el,
      methods: {
        test: function () {
          var that = this
          return new Promise(function (resolve) {
            setTimeout(function () {
              expect(that._vsourcePending).toBe(2)
              expect(ready.calls.count()).toBe(0)
              resolve({ a: 1 })
            }, 50)
          })
        },
        test1: function () {
          var that = this
          return new Promise(function (resolve) {
            setTimeout(function () {
              expect(that._vsourcePending).toBe(1)
              expect(ready.calls.count()).toBe(0)
              resolve({ b: 2 })
            }, 100)
          })
        }
      },
      ready: ready
    })

    expect(vm._vsourcePending).toBe(2)
    expect(ready.calls.count()).toBe(0)

    setTimeout(function () {
      expect(vm._vsourcePending).toBe(0)
      expect(ready.calls.count()).toBe(1)
      expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<div>1</div><div>2</div>')
      done()
    }, 200)
  })
})
