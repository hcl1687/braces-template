var _ = require('src/util')

describe('Util - Language Enhancement', function () {
  it('hasOwn', function () {
    var obj1 = { a: 1 }
    expect(_.hasOwn(obj1, 'a')).to.equal(true)
    var obj2 = Object.create(null)
    obj2.a = 2
    expect(_.hasOwn(obj2, 'a')).to.equal(true)
  })

  it('isLiteral', function () {
    expect(_.isLiteral('123')).to.equal(true)
    expect(_.isLiteral('12.3')).to.equal(true)
    expect(_.isLiteral('true')).to.equal(true)
    expect(_.isLiteral(' false ')).to.equal(true)
    expect(_.isLiteral('"foo"')).to.equal(true)
    expect(_.isLiteral(" 'foo' ")).to.equal(true)
    expect(_.isLiteral('a.b.c')).to.equal(false)
    expect(_.isLiteral('1 + 1')).to.equal(false)
  })

  it('toString', function () {
    expect(_._toString('foo')).to.equal('foo')
    expect(_._toString(1.234)).to.equal('1.234')
    expect(_._toString(null)).to.equal('')
    expect(_._toString(undefined)).to.equal('')
  })

  it('toNumber', function () {
    expect(_.toNumber('12')).to.equal(12)
    expect(_.toNumber('1e5')).to.equal(1e5)
    expect(_.toNumber('0x2F')).to.equal(0x2F)
    expect(_.toNumber(null)).to.equal(null)
    expect(_.toNumber(true)).to.equal(true)
    expect(_.toNumber('hello')).to.equal('hello')
  })

  it('strip quotes', function () {
    expect(_.stripQuotes('"123"')).to.equal('123')
    expect(_.stripQuotes("'fff'")).to.equal('fff')
    expect(_.stripQuotes("'fff")).to.equal("'fff")
  })

  it('camelize', function () {
    expect(_.camelize('abc')).to.equal('abc')
    expect(_.camelize('some-long-name')).to.equal('someLongName')
  })

  it('hyphenate', function () {
    expect(_.hyphenate('fooBar')).to.equal('foo-bar')
    expect(_.hyphenate('a1BfC')).to.equal('a1-bf-c')
    expect(_.hyphenate('already-With-Hyphen')).to.equal('already-with-hyphen')
  })

  it('classify', function () {
    expect(_.classify('abc')).to.equal('Abc')
    expect(_.classify('foo-bar')).to.equal('FooBar')
    expect(_.classify('foo_bar')).to.equal('FooBar')
    expect(_.classify('foo/bar')).to.equal('FooBar')
  })

  it('bind', function () {
    var original = function (a) {
      return this.a + a
    }
    var ctx = { a: 'ctx a ' }
    var bound = _.bind(original, ctx)
    var res = bound('arg a')
    expect(res).to.equal('ctx a arg a')
  })

  it('toArray', function () {
    // should make a copy of original array
    var arr = [1, 2, 3]
    var res = _.toArray(arr)
    expect(Array.isArray(res)).to.equal(true)
    expect(res).not.to.equal(arr)

    // should work on arguments
    ;(function () {
      var res = _.toArray(arguments)
      expect(Array.isArray(res)).to.equal(true)
    })(1, 2, 3)
  })

  it('extend', function () {
    var from = {a: 1, b: 2}
    var to = {}
    var res = _.extend(to, from)
    expect(to.a).to.equal(from.a)
    expect(to.b).to.equal(from.b)
    expect(res).to.equal(to)
  })

  it('isObject', function () {
    expect(_.isObject({})).to.equal(true)
    expect(_.isObject([])).to.equal(true)
    expect(_.isObject(null)).to.equal(false)
    expect(_.isObject(123)).to.equal(false)
    expect(_.isObject(true)).to.equal(false)
    expect(_.isObject('foo')).to.equal(false)
    expect(_.isObject(undefined)).to.equal(false)
    expect(_.isObject(function () {})).to.equal(false)
  })

  it('isPlainObject', function () {
    expect(_.isPlainObject({})).to.equal(true)
    expect(_.isPlainObject([])).to.equal(false)
    expect(_.isPlainObject(null)).to.equal(false)
    expect(_.isPlainObject(null)).to.equal(false)
    expect(_.isPlainObject(123)).to.equal(false)
    expect(_.isPlainObject(true)).to.equal(false)
    expect(_.isPlainObject('foo')).to.equal(false)
    expect(_.isPlainObject(undefined)).to.equal(false)
    expect(_.isPlainObject(function () {})).to.equal(false)
    expect(_.isPlainObject(window)).to.equal(false)
  })

  it('isArray', function () {
    expect(_.isArray([])).to.equal(true)
    expect(_.isArray({})).to.equal(false)
    expect(_.isArray(arguments)).to.equal(false)
  })

  it('debounce', function (done) {
    var count = 0
    var fn = _.debounce(function () {
      count++
    }, 100)
    fn()
    setTimeout(fn, 10)
    setTimeout(fn, 20)
    setTimeout(function () {
      expect(count).to.equal(0)
    }, 30)
    setTimeout(function () {
      expect(count).to.equal(1)
      done()
    }, 200)
  })

  it('looseEqual', function () {
    expect(_.looseEqual(1, '1')).to.equal(true)
    expect(_.looseEqual(null, undefined)).to.equal(true)
    expect(_.looseEqual({a: 1}, {a: 1})).to.equal(true)
    expect(_.looseEqual({a: 1}, {a: 2})).to.equal(false)
    expect(_.looseEqual({}, [])).to.equal(false)
  })
})
