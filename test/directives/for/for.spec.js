var _ = require('src/util')
var Vue = require('src')
var textContent = _.textContent

function done () {}

describe('v-for', function () {
  var el
  beforeEach(function () {
    el = document.createElement('div')
  })

  it('objects', function () {
    el.innerHTML = '<div v-for="item in items">{{$index}} {{item.a}}</div>'
    var vm = new Vue({
      el: el,
      data: {
        items: [{a: 1}, {a: 2}]
      }
    })
    assertMutations(vm, el, done)
  })

  it('primitives', function () {
    el.innerHTML = '<div v-for="item in items">{{$index}} {{item}}</div>'
    var vm = new Vue({
      el: el,
      data: {
        items: [1, 2, 3]
      }
    })
    assertPrimitiveMutations(vm, el)
  })

  it('object of objects', function () {
    el.innerHTML = '<div v-for="item in items">{{$index}} {{$key}} {{item.a}}</div>'
    var vm = new Vue({
      el: el,
      data: {
        items: {
          a: {a: 1},
          b: {a: 2}
        }
      }
    })
    assertObjectMutations(vm, el)
  })

  it('object of primitives', function () {
    el.innerHTML = '<div v-for="item in items">{{$index}} {{$key}} {{item}}</div>'
    var vm = new Vue({
      el: el,
      data: {
        items: {
          a: 1,
          b: 2
        }
      }
    })
    assertObjectPrimitiveMutations(vm, el)
  })

  it('array of arrays', function () {
    el.innerHTML = '<div v-for="item in items">{{$index}} {{item}}</div>'
    var vm = new Vue({
      el: el,
      data: {
        items: [[1, 1], [2, 2], [3, 3]]
      }
    })
    var markup = vm.items.map(function (item, i) {
      return '<div>' + i + ' ' + item.toString() + '</div>'
    }).join('')
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe(markup)
  })

  it('check priorities: v-if before v-for', function () {
    el.innerHTML = '<div v-if="item < 3" v-for="item in items">{{item}}</div>'
    new Vue({
      el: el,
      data: {
        items: [1, 2, 3]
      }
    })
    expect(textContent(el).replace(/\r\n/g, '')).toBe('12')
  })

  it('check priorities: v-if after v-for', function () {
    el.innerHTML = '<div v-for="item in items" v-if="item < 3">{{item}}</div>'
    new Vue({
      el: el,
      data: {
        items: [1, 2, 3]
      }
    })
    expect(textContent(el).replace(/\r\n/g, '')).toBe('12')
  })

  it('nested loops', function () {
    el.innerHTML = '<div v-for="item in items">' +
          '<p v-for="subItem in item.items">{{$index}} {{subItem.a}} {{$parent.$index}} {{item.a}}</p>' +
        '</div>'
    new Vue({
      el: el,
      data: {
        items: [
          { items: [{a: 1}, {a: 2}], a: 1 },
          { items: [{a: 3}, {a: 4}], a: 2 }
        ]
      }
    })
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe(
      '<div><p>0 1 0 1</p><p>1 2 0 1</p></div>' +
      '<div><p>0 3 1 2</p><p>1 4 1 2</p></div>'
    )
  })

  it('nested loops on object', function () {
    el.innerHTML = '<div v-for="list in listHash">' +
          '{{$key}}' +
          '<p v-for="item in list">{{item.a}}</p>' +
        '</div>'
    new Vue({
      el: el,
      data: {
        listHash: {
          listA: [{a: 1}, {a: 2}],
          listB: [{a: 1}, {a: 2}]
        }
      }
    })
    function output (key) {
      var key1 = key === 'listA' ? 'listB' : 'listA'
      if (_.isIE8) {
        return '<DIV>' + key + '<P>1</P><P>2</P></DIV>' +
             '<DIV>' + key1 + '<P>1</P><P>2</P></DIV>'
      }
      return '<div>' + key + '<p>1</p><p>2</p></div>' +
             '<div>' + key1 + '<p>1</p><p>2</p></div>'
    }

    var innerHTML = el.innerHTML.replace(/\r\n/g, '')
    expect(innerHTML === output('listA') || innerHTML === output('listB')).toBe(true)
  })

  it('div loop', function () {
    el.innerHTML = '<div v-for="item in list"><p>{{item.a}}</p><p>{{item.a + 1}}</p></div>'
    var vm = new Vue({
      el: el,
      data: {
        list: [
          { a: 1 },
          { a: 2 },
          { a: 3 }
        ]
      }
    })
    assertMarkup()

    function assertMarkup () {
      var markup = vm.list.map(function (item) {
        return '<div><p>' + item.a + '</p><p>' + (item.a + 1) + '</p></div>'
      }).join('')
      expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe(markup)
    }
  })

  it('warn missing alias', function () {
    el.innerHTML = '<div v-for="items"></div>'
    new Vue({
      el: el
    })
    expect(_.warn.msg).toContain('alias is required')
  })

  it('key val syntax with object', function () {
    el.innerHTML = '<div v-for="(key,val) in items">{{$index}} {{key}} {{val.a}}</div>'
    var vm = new Vue({
      el: el,
      data: {
        items: {
          a: {a: 1},
          b: {a: 2}
        }
      }
    })
    assertObjectMutations(vm, el)
  })

  it('key val syntax with array', function () {
    el.innerHTML = '<div v-for="(i, item) in items">{{i}} {{item.a}}</div>'
    var vm = new Vue({
      el: el,
      data: {
        items: [{a: 1}, {a: 2}]
      }
    })
    assertMutations(vm, el)
  })

  it('key val syntax with nested v-for s', function () {
    el.innerHTML = '<div v-for="(key,val) in items"><div v-for="(subkey,subval) in val">{{key}} {{subkey}} {{subval}}</div></div>'
    new Vue({
      el: el,
      data: {
        items: {'a': {'b': 'c'}}
      }
    })
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<div><div>a b c</div></div>')
  })

  it('repeat number', function () {
    el.innerHTML = '<div v-for="n in 3">{{$index}} {{n}}</div>'
    new Vue({
      el: el
    })
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<div>0 0</div><div>1 1</div><div>2 2</div>')
  })

  it('repeat string', function () {
    el.innerHTML = '<div v-for="letter in \'vue\'">{{$index}} {{letter}}</div>'
    new Vue({
      el: el
    })
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<div>0 v</div><div>1 u</div><div>2 e</div>')
  })

  it('teardown', function () {
    el.innerHTML = '<div v-for="item in items"></div>'
    var vm = new Vue({
      el: el,
      data: {
        items: [{a: 1}, {a: 2}]
      }
    })
    vm._directives[0].unbind()
    expect(vm._directives[0].frags.length).toBe(0)
  })

  it('access parent scope\'s $els', function () {
    el.innerHTML = '<div data-d=1 v-el:a><div v-for="n in 2">{{ready ? 1 : 0}}</div></div>'
    var vm = new Vue({
      el: el,
      data: {
        ready: true
      }
    })
    expect(vm.$els.a.nodeType).toBe(1)
    expect(vm.$els.a.innerHTML.replace(/\r\n/g, '').toLowerCase()).toContain('<div>1</div><div>1</div>')
  })
})

/**
 * Assert mutation and markup correctness for v-for on
 * an Array of Objects
 */

function assertMutations (vm, el) {
  assertMarkup()

  function assertMarkup () {
    var tag = el.children[0].tagName.toLowerCase()
    var markup = vm.items.map(function (item, i) {
      var el = '<' + tag + '>' + i + ' ' + item.a + '</' + tag + '>'
      return el
    }).join('')
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe(markup)
  }
}

/**
 * Assert mutation and markup correctness for v-for on
 * an Array of primitive values
 */

function assertPrimitiveMutations (vm, el) {
  assertMarkup()

  function assertMarkup () {
    var markup = vm.items.map(function (item, i) {
      return '<div>' + i + ' ' + item + '</div>'
    }).join('')
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe(markup)
  }
}

/**
 * Assert mutation and markup correctness for v-for on
 * an Object of Objects
 */

function assertObjectMutations (vm, el) {
  assertMarkup()

  function assertMarkup () {
    var markup = Object.keys(vm.items).map(function (key, i) {
      return '<div>' + i + ' ' + key + ' ' + vm.items[key].a + '</div>'
    }).join('')
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe(markup)
  }
}

/**
 * Assert mutation and markup correctness for v-for on
 * an Object of primitive values
 */

function assertObjectPrimitiveMutations (vm, el, done) {
  assertMarkup()

  function assertMarkup () {
    var markup = Object.keys(vm.items).map(function (key, i) {
      return '<div>' + i + ' ' + key + ' ' + vm.items[key] + '</div>'
    }).join('')
    expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe(markup)
  }
}
