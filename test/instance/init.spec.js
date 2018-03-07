var Braces = require('src')
var init = Braces.prototype._init

describe('Instance Init', function () {
  var stub = {
    constructor: {
      options: { a: 1, b: 2 }
    },
    _initEvents: jasmine.createSpy(),
    _callHook: jasmine.createSpy(),
    _initState: jasmine.createSpy(),
    $mount: jasmine.createSpy()
  }

  var options = {
    a: 2,
    el: {}
  }

  init.call(stub, options)

  it('should setup properties', function () {
    expect(stub.$el).toBe(null)
    expect(stub.$root).toBe(stub)
    expect(stub.$els).toBeTruthy()
    expect(stub._directives).toBeTruthy()
    expect(stub._events).toBeTruthy()
  })

  it('should merge options', function () {
    expect(stub.$options.a).toBe(2)
    expect(stub.$options.b).toBe(2)
  })

  it('should call other init methods', function () {
    expect(stub._initEvents).toHaveBeenCalled()
    expect(stub._initState).toHaveBeenCalled()
  })

  it('should call created hook', function () {
    expect(stub._callHook).toHaveBeenCalledWith('created')
  })

  it('should call $mount when options.el is present', function () {
    expect(stub.$mount).toHaveBeenCalledWith(stub.$options.el)
  })
})
