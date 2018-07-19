var parse = require('src/parsers/directive').parseDirective

describe('Directive Parser', function () {
  it('simple', function () {
    var res = parse('exp')
    expect(res.expression).toBe('exp')
  })

  it('single quote + boolean', function () {
    var res = parse('a ? \'b\' : c')
    expect(res.expression).toBe('a ? \'b\' : c')
  })

  it('double quote + boolean', function () {
    var res = parse('"a:b:c||d|e|f" || d ? a : b')
    expect(res.expression).toBe('"a:b:c||d|e|f" || d ? a : b')
  })

  it('nested function calls + array/object literals', function () {
    var res = parse('test(c.indexOf(d,f),"e,f")')
    expect(res.expression).toBe('test(c.indexOf(d,f),"e,f")')
  })

  it('array literal', function () {
    var res = parse('d || [e,f]')
    expect(res.expression).toBe('d || [e,f]')
  })

  it('object literal', function () {
    var res = parse('{a: 1, b: 2}')
    expect(res.expression).toBe('{a: 1, b: 2}')
  })

  it('escape string', function () {
    var res = parse("'a\\'b'")
    expect(res.expression).toBe("'a\\'b'")
  })

  it('cache', function () {
    var res1 = parse('a || b')
    var res2 = parse('a || b')
    expect(res1).toBe(res2)
  })
})
