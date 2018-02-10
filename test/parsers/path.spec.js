var Path = require('src/parsers/path')
var _ = require('src/util')

function assertPath (str, expected) {
  var path = Path.parsePath(str)
  var res = pathMatch(path, expected)
  expect(res).to.equal(true)
  if (!res) {
    console.log('Path parse failed: ', str, path)
  }
}

function assertInvalidPath (str) {
  var path = Path.parsePath(str)
  expect(path).to.equal(undefined)
}

function pathMatch (a, b) {
  if (a.length !== b.length) {
    return false
  }
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

describe('Path Parser', function () {
  it('parse simple paths', function () {
    assertPath('', [])
    assertPath(' ', [])
    assertPath('a', ['a'])
    assertPath('a.b', ['a', 'b'])
    assertPath('a. b', ['a', 'b'])
    assertPath('a .b', ['a', 'b'])
    assertPath('a . b', ['a', 'b'])
    assertPath(' a . b ', ['a', 'b'])
    assertPath('a[0]', ['a', '0'])
    assertPath('a [0]', ['a', '0'])
    assertPath('a[0][1]', ['a', '0', '1'])
    assertPath('a [ 0 ] [ 1 ] ', ['a', '0', '1'])
    assertPath('[1234567890] ', ['1234567890'])
    assertPath(' [1234567890] ', ['1234567890'])
    assertPath('opt0', ['opt0'])
    assertPath('$foo.$bar._baz', ['$foo', '$bar', '_baz'])
    assertPath('foo["baz"]', ['foo', 'baz'])
  })

  it('parse dynamic paths', function () {
    assertPath('foo["b\\"az"]', ['foo', '*"b\\"az"'])
    assertPath("foo['b\\'az']", ['foo', "*'b\\'az'"])
    assertPath('a[b][c]', ['a', '*b', '*c'])
    assertPath('a[ b ][ c ]', ['a', '*b', '*c'])
    assertPath('a[b.c]', ['a', '*b.c'])
    assertPath('a[b + "c"]', ['a', '*b + "c"'])
    assertPath('a[b[c]]', ['a', '*b[c]'])
    assertPath('a["c" + b]', ['a', '*"c" + b'])
  })

  it('handle invalid paths', function () {
    assertInvalidPath('.')
    assertInvalidPath(' . ')
    assertInvalidPath('..')
    assertInvalidPath('a[4')
    assertInvalidPath('a.b.')
    assertInvalidPath('a,b')
    assertInvalidPath('a["foo]')
    assertInvalidPath('[0foo]')
    assertInvalidPath('foo-bar')
    assertInvalidPath('42')
    assertInvalidPath('  42   ')
    assertInvalidPath('foo["bar]')
    assertInvalidPath("foo['bar]")
    assertInvalidPath('a]')
  })

  it('caching', function () {
    var path1 = Path.parsePath('a.b.c')
    var path2 = Path.parsePath('a.b.c')
    expect(path1).to.equal(path2)
  })

  it('get', function () {
    var path = 'a[\'b"b"c\'][0]'
    var obj = {
      a: {
        'b"b"c': [12345]
      }
    }
    expect(Path.getPath(obj, path)).to.equal(12345)
    expect(Path.getPath(obj, 'a.c')).to.equal(undefined)
  })

  it('get dynamic', function () {
    var path = 'a[b]'
    var obj = {
      a: {
        key: 123
      },
      b: 'key'
    }
    expect(Path.getPath(obj, path)).to.equal(123)
  })
})
