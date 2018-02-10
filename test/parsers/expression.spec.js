var expParser = require('src/parsers/expression')
var _ = require('src/util')

var testCases = [
  {
    // simple path
    exp: 'a.b.d',
    scope: {
      a: {
        b: { d: 123 }
      }
    },
    expected: 123,
    paths: ['a']
  },
  // complex path
  {
    exp: 'a["b"].c',
    scope: {
      a: {
        b: { c: 234 }
      }
    },
    expected: 234,
    paths: ['a']
  },
  {
    // string concat
    exp: 'a+b',
    scope: {
      a: 'hello',
      b: 'world'
    },
    expected: 'helloworld',
    paths: ['a', 'b']
  },
  {
    // math
    exp: 'a - b * 2 + 45',
    scope: {
      a: 100,
      b: 23
    },
    expected: 100 - 23 * 2 + 45,
    paths: ['a', 'b']
  },
  {
    // boolean logic
    exp: '(a && b) ? c : d || e',
    scope: {
      a: true,
      b: false,
      c: null,
      d: false,
      e: 'worked'
    },
    expected: 'worked',
    paths: ['a', 'b', 'c', 'd', 'e']
  },
  {
    // inline string with newline
    exp: "a + 'hel\nlo'",
    scope: {
      a: 'inline '
    },
    expected: 'inline hel\nlo',
    paths: ['a']
  },
  {
    // multiline expressions
    exp: "{\n a: '35',\n b: c}",
    scope: {c: 32},
    expected: { a: '35', b: 32 }
  },
  {
    // dollar signs and underscore
    exp: "_a + ' ' + $b",
    scope: {
      _a: 'underscore',
      $b: 'dollar'
    },
    expected: 'underscore dollar',
    paths: ['_a', '$b']
  },
  {
    // complex with nested values
    exp: "todo.title + ' : ' + (todo['done'] ? 'yep' : 'nope')",
    scope: {
      todo: {
        title: 'write tests',
        done: false
      }
    },
    expected: 'write tests : nope',
    paths: ['todo']
  },
  {
    // expression with no data variables
    exp: "'a' + 'b'",
    scope: {},
    expected: 'ab',
    paths: []
  },
  {
    // values with same variable name inside strings
    exp: "'\"test\"' + test + \"'hi'\" + hi",
    scope: {
      test: 1,
      hi: 2
    },
    expected: '"test"1\'hi\'2',
    paths: ['test', 'hi']
  },
  {
    // expressions with inline object literals
    exp: "sortRows({ column: 'name', test: foo, durrr: 123 })",
    scope: {
      sortRows: function (params) {
        return params.column + params.test + params.durrr
      },
      foo: 'bar'
    },
    expected: 'namebar123',
    paths: ['sortRows', 'bar']
  },
  {
    // space between path segments
    exp: '  a    .   b    .  c + d',
    scope: {
      a: {
        b: { c: 12 }
      },
      d: 3
    },
    expected: 15,
    paths: ['a', 'd']
  },
  {
    // space in bracket identifiers
    exp: ' a[ " a.b.c " ] + b  [ \' e \' ]',
    scope: {
      a: {' a.b.c ': 123},
      b: {' e ': 234}
    },
    expected: 357,
    paths: ['a', 'b']
  },
  {
    // number literal
    exp: 'a * 1e2 + 1.1',
    scope: {
      a: 3
    },
    expected: 301.1,
    paths: ['a']
  },
  {
    // keyowrd + keyword literal
    exp: 'true && a.true',
    scope: {
      a: { 'true': false }
    },
    expected: false,
    paths: ['a']
  },
  {
    // super complex
    exp: ' $a + b[ "  a.b.c  " ][\'123\'].$e&&c[ " d " ].e + Math.round(e) ',
    scope: {
      $a: 1,
      b: {
        '  a.b.c  ': {
          '123': { $e: 2 }
        }
      },
      c: {
        ' d ': {e: 3}
      },
      e: 4.5
    },
    expected: 8,
    paths: ['$a', 'b', 'c', 'e']
  },
  {
    // string with escaped quotes
    exp: "'a\\'b' + c",
    scope: {
      c: '\'c'
    },
    expected: "a'b'c",
    paths: ['c']
  },
  {
    // dynamic sub path
    exp: "a['b' + i + 'c']",
    scope: {
      i: 0,
      a: {
        'b0c': 123
      }
    },
    expected: 123,
    paths: ['a', 'i']
  },
  {
    // Math global, simple path
    exp: 'Math.PI',
    scope: {},
    expected: Math.PI,
    paths: []
  },
  {
    // Math global, exp
    exp: 'Math.sin(a)',
    scope: {
      a: 1
    },
    expected: Math.sin(1),
    paths: ['a']
  },
  {
    // boolean literal
    exp: 'true',
    scope: {
      true: false
    },
    expected: true,
    paths: []
  },
  {
    exp: 'null',
    scope: {},
    expected: null,
    paths: []
  },
  {
    exp: 'undefined',
    scope: { undefined: 1 },
    expected: undefined,
    paths: []
  },
  {
    // Date global
    exp: 'Date.now() > new Date("2000-01-01")',
    scope: {},
    expected: true,
    paths: []
  },
  // typeof operator
  {
    exp: 'typeof test === "string"',
    scope: { test: '123' },
    expected: true,
    paths: ['test']
  },
  // isNaN
  {
    exp: 'isNaN(a)',
    scope: { a: 2 },
    expected: false,
    paths: ['a']
  },
  // parseFloat & parseInt
  {
    exp: 'parseInt(a, 10) + parseFloat(b)',
    scope: { a: 2.33, b: '3.45' },
    expected: 5.45,
    paths: ['a', 'b']
  }
]

describe('Expression Parser', function () {
  testCases.forEach(function (testCase) {
    it('parse getter: ' + testCase.exp, function () {
      var res = expParser.parseExpression(testCase.exp, true)
      expect(JSON.stringify(res.get(testCase.scope)))
        .to.equal(JSON.stringify(testCase.expected))
    })
  })

  it('cache', function () {
    var res1 = expParser.parseExpression('a + b')
    var res2 = expParser.parseExpression('a + b')
    expect(res1).to.equal(res2)
  })

  describe('invalid expression', function () {
    it('should warn on invalid expression', function () {
      expParser.parseExpression('a--b"ffff')
      expect(_.warn.msg).to.include('Invalid expression')
    })

    it('should warn if expression contains improper reserved keywords', function () {
      expParser.parseExpression('break + 1')
      expect(_.warn.msg).to.include('Avoid using reserved keywords')
    })
  })
})

// function canMakeTemplateStringFunction () {
//   try {
//     /* eslint-disable no-new-func */
//     new Function('a', 'return `${a}`')
//   } catch (e) {
//     return false
//   }
//   return true
// }
