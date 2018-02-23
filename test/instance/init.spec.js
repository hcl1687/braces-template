var Vue = require('src')
var init = Vue.prototype._init

describe('Instance Init', function () {
  var stub = {
    constructor: {
      options: { a: 1, b: 2 }
    },
    _initEvents: sinon.spy(),
    _callHook: sinon.spy(),
    _initState: sinon.spy(),
    $mount: sinon.spy()
  }

  var options = {
    a: 2,
    el: {}
  }

  init.call(stub, options)

  it('should setup properties', function () {
    expect(stub.$el).to.equal(null)
    expect(stub.$root).to.equal(stub)
    expect(stub.$els).to.eql({})
    expect(stub._directives).to.eql([])
    expect(stub._events).to.eql({})
  })

  it('should merge options', function () {
    expect(stub.$options.a).to.equal(2)
    expect(stub.$options.b).to.equal(2)
  })

  it('should call other init methods', function () {
    expect(stub._initEvents.called).to.equal(true)
    expect(stub._initState.called).to.equal(true)
  })

  it('should call created hook', function () {
    expect(stub._callHook.calledWith('created')).to.equal(true)
  })

  it('should call $mount when options.el is present', function () {
    expect(stub.$mount.calledWith(stub.$options.el)).to.equal(true)
  })
})
