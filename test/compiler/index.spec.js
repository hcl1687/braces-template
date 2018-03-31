var Braces = require('src')
var _ = require('src/util')
var FragmentFactory = require('src/fragment/factory')
var compiler = require('src/compiler')
var compile = compiler.compile
var publicDirectives = require('src/directives/public')
var textContent = _.textContent

describe('Compile', function () {
  var vm, el, directiveBind, directiveTeardown, bindDirSpy
  beforeEach(function () {
    // We mock vms here so we can assert what the generated
    // linker functions do.
    el = document.createElement('div')
    directiveBind = jasmine.createSpy('bind')
    directiveTeardown = jasmine.createSpy('teardown')
    bindDirSpy = jasmine.createSpy()
    vm = {
      $options: {},
      _directives: [],
      _bindDir: function (descriptor, node) {
        bindDirSpy(descriptor, node)
        this._directives.push({
          name: descriptor.name,
          descriptor: descriptor,
          _bind: function () {
            directiveBind(this.name)
          },
          _teardown: directiveTeardown
        })
      },
      $get: function (exp) {
        return (new Braces()).$get(exp)
      }
    }
  })

  it('normal directives', function () {
    el.setAttribute('v-a', 'b')
    el.innerHTML = '<p v-a:hello.a.b="a" v-b="1">hello</p><div v-b.literal="foo"></div>'
    var defA = { priority: 1 }
    var defB = { priority: 2 }
    var options = _.mergeOptions(Braces.options, {
      directives: {
        a: defA,
        b: defB
      }
    })
    var linker = compile(el, options)
    expect(typeof linker).toBe('function')
    linker(vm, el)
    expect(directiveBind.calls.count()).toBe(4)
    expect(bindDirSpy.calls.count()).toBe(4)

    // check if we are in firefox, which has different
    // attribute interation order
    var isAttrReversed = el.firstChild.attributes[0].name === 'v-b'

    // 1
    var args = bindDirSpy.calls.argsFor(0)
    expect(args[0].name).toBe('a')
    expect(args[0].expression).toBe('b')
    expect(args[0].def).toBe(defA)
    expect(args[1]).toBe(el)
    // 2
    args = bindDirSpy.calls.argsFor(isAttrReversed ? 2 : 1)
    expect(args[0].name).toBe('a')
    expect(args[0].expression).toBe('a')
    expect(args[0].def).toBe(defA)
    // args + multiple modifiers
    expect(args[0].arg).toBe('hello')
    expect(args[0].modifiers.a).toBe(true)
    expect(args[0].modifiers.b).toBe(true)
    expect(args[1]).toBe(el.firstChild)
    // 3 (expression literal)
    args = bindDirSpy.calls.argsFor(isAttrReversed ? 1 : 2)
    expect(args[0].name).toBe('b')
    expect(args[0].expression).toBe('1')
    expect(args[0].def).toBe(defB)
    expect(args[1]).toBe(el.firstChild)
    // 4 (explicit literal)
    args = bindDirSpy.calls.argsFor(3)
    expect(args[0].name).toBe('b')
    expect(args[0].expression).toBe('foo')
    expect(args[0].def).toBe(defB)
    expect(args[0].modifiers.literal).toBe(true)
    expect(args[1]).toBe(el.lastChild)
    // check the priority sorting
    // the "b"s should be called first!
    expect(directiveBind.calls.argsFor(0)[0]).toBe('b')
    expect(directiveBind.calls.argsFor(1)[0]).toBe('b')
    expect(directiveBind.calls.argsFor(2)[0]).toBe('a')
    expect(directiveBind.calls.argsFor(3)[0]).toBe('a')
  })

  it('v-bind shorthand', function () {
    el.setAttribute(':class', 'a')
    el.setAttribute(':style', 'b')
    el.setAttribute(':title', 'c')

    // The order of setAttribute is not guaranteed to be the same with
    // the order of attribute enumberation, therefore we need to save
    // it here!
    var descriptors = {
      ':class': {
        name: 'bind',
        attr: ':class',
        expression: 'a',
        def: publicDirectives.bind
      },
      ':style': {
        name: 'bind',
        attr: ':style',
        expression: 'b',
        def: publicDirectives.bind
      },
      ':title': {
        name: 'bind',
        attr: ':title',
        expression: 'c',
        arg: 'title',
        def: publicDirectives.bind
      }
    }
    var expects = [].map.call(el.attributes, function (attr) {
      return descriptors[attr.name]
    })

    var linker = compile(el, Braces.options)
    linker(vm, el)
    expect(bindDirSpy.calls.count()).toBe(3)

    expects.forEach(function (e, i) {
      var args = bindDirSpy.calls.argsFor(i)
      for (var key in e) {
        expect(args[0][key]).toBe(e[key])
      }
      expect(args[1]).toBe(el)
    })
  })

  it('v-on shorthand', function () {
    el.innerHTML = '<div @click="a++"></div>'
    el = el.firstChild
    var linker = compile(el, Braces.options)
    linker(vm, el)
    expect(bindDirSpy.calls.count()).toBe(1)
    var args = bindDirSpy.calls.argsFor(0)
    expect(args[0].name).toBe('on')
    expect(args[0].expression).toBe('a++')
    expect(args[0].arg).toBe('click')
    expect(args[0].def).toBe(publicDirectives.on)
    expect(args[1]).toBe(el)
  })

  it('text interpolation', function () {
    vm.b = 'yeah'
    el.innerHTML = '{{a}} and {{b}}'
    var def = Braces.options.directives.text
    var linker = compile(el, Braces.options)
    linker(vm, el)
    // expect 1 call because one-time bindings do not generate a directive.
    expect(bindDirSpy.calls.count()).toBe(2)
    var args = bindDirSpy.calls.argsFor(0)
    expect(args[0].name).toBe('text')
    expect(args[0].expression).toBe('a')
    expect(args[0].def).toBe(def)
    // bind 被spy替代了。所以不会翻译为最终的结果
    expect(el.innerHTML).toContain(' and ')
  })

  it('text interpolation, adjacent nodes', function () {
    vm.b = 'yeah'
    el.appendChild(document.createTextNode('{{a'))
    el.appendChild(document.createTextNode('}} and {{'))
    el.appendChild(document.createTextNode('b}}'))
    var def = Braces.options.directives.text
    var linker = compile(el, Braces.options)
    linker(vm, el)
    // expect 1 call because one-time bindings do not generate a directive.
    expect(bindDirSpy.calls.count()).toBe(2)
    var args = bindDirSpy.calls.argsFor(0)
    expect(args[0].name).toBe('text')
    expect(args[0].expression).toBe('a')
    expect(args[0].def).toBe(def)
    // bind 被spy替代了。所以不会翻译为最终的结果
    expect(el.innerHTML).toContain('  and  ')
  })

  it('adjacent text nodes with no interpolation', function () {
    el.appendChild(document.createTextNode('a'))
    el.appendChild(document.createTextNode('b'))
    el.appendChild(document.createTextNode('c'))
    var linker = compile(el, Braces.options)
    linker(vm, el)
    expect(el.innerHTML).toBe('abc')
  })

  it('inline html', function () {
    vm.html = '<div>foo</div>'
    el.innerHTML = '{{{html}}} {{{html}}}'
    var htmlDef = Braces.options.directives.html
    var linker = compile(el, Braces.options)
    linker(vm, el)
    expect(bindDirSpy.calls.count()).toBe(2)
    var htmlArgs = bindDirSpy.calls.argsFor(0)
    expect(htmlArgs[0].name).toBe('html')
    expect(htmlArgs[0].expression).toBe('html')
    expect(htmlArgs[0].def).toBe(htmlDef)
    // bind 被spy替代了。所以不会翻译为最终的结果
    expect(el.innerHTML).toBe('<!--v-html--> <!--v-html-->')
  })

  it('terminal directives', function () {
    el.innerHTML =
      '<div v-for="item in items"><p v-a="b"></p></div>' + // v-for
      '<div v-pre><p v-a="b"></p></div>' // v-pre
    var def = Braces.options.directives.for
    var linker = compile(el, Braces.options)
    linker(vm, el)
    // expect 1 call because terminal should return early and let
    // the directive handle the rest.
    expect(bindDirSpy.calls.count()).toBe(1)
    var args = bindDirSpy.calls.argsFor(0)
    expect(args[0].name).toBe('for')
    expect(args[0].expression).toBe('item in items')
    expect(args[0].def).toBe(def)
    expect(args[1]).toBe(el.firstChild)
  })

  it('custom terminal directives', function () {
    var defTerminal = {
      terminal: true,
      priority: Braces.options.directives.if.priority + 1
    }
    var options = _.mergeOptions(Braces.options, {
      directives: { term: defTerminal }
    })
    el.innerHTML = '<div v-term:arg1.modifier1.modifier2="foo"></div>'
    var linker = compile(el, options)
    linker(vm, el)
    expect(bindDirSpy.calls.count()).toBe(1)
    var args = bindDirSpy.calls.argsFor(0)
    expect(args[0].name).toBe('term')
    expect(args[0].expression).toBe('foo')
    expect(args[0].attr).toBe('v-term:arg1.modifier1.modifier2')
    expect(args[0].arg).toBe('arg1')
    expect(args[0].modifiers.modifier1).toBe(true)
    expect(args[0].modifiers.modifier2).toBe(true)
    expect(args[0].def).toBe(defTerminal)
  })

  it('custom terminal directives priority', function () {
    var defTerminal = {
      terminal: true,
      priority: Braces.options.directives.if.priority + 1
    }
    var options = _.mergeOptions(Braces.options, {
      directives: { term: defTerminal }
    })
    el.innerHTML = '<div v-term:arg1 v-if="ok"></div>'
    var linker = compile(el, options)
    linker(vm, el)
    expect(bindDirSpy.calls.count()).toBe(1)
    var args = bindDirSpy.calls.argsFor(0)
    expect(args[0].name).toBe('term')
    expect(args[0].expression).toBe('')
    expect(args[0].attr).toBe('v-term:arg1')
    expect(args[0].arg).toBe('arg1')
    expect(args[0].def).toBe(defTerminal)
  })

  it('DocumentFragment', function () {
    var frag = document.createDocumentFragment()
    frag.appendChild(el)
    var el2 = document.createElement('div')
    frag.appendChild(el2)
    el.innerHTML = '{{a}}'
    el2.innerHTML = '{{b}}'
    vm.a = 'A'
    vm.b = 'B'
    var linker = compile(frag, Braces.options)
    linker(vm, frag)
    expect(el.innerHTML).toBe(' ')
    expect(el2.innerHTML).toBe(' ')
  })

  it('partial compilation', function () {
    el.innerHTML = '<div v-bind:test="abc">{{bcd}}<p v-show="ok"></p></div>'
    var linker = compile(el, Braces.options, true)
    var decompile = linker(vm, el)
    expect(vm._directives.length).toBe(3)
    decompile()
    expect(directiveTeardown.calls.count()).toBe(3)
    expect(vm._directives.length).toBe(0)
  })

  it('skip script tags', function () {
    el.innerHTML = '<script type="text/x-template">{{test}}</script>'
    var linker = compile(el, Braces.options)
    linker(vm, el)
    expect(bindDirSpy.calls.count()).toBe(0)
  })

  it('attribute interpolation', function () {
    el.innerHTML = '<div id="{{a}}" class="b bla-{{c}} d"></div>'
    new Braces({
      el: el,
      data: {
        a: 'aaa',
        c: 'ccc'
      }
    })
    expect(el.firstChild.id).toBe('aaa')
    expect(el.firstChild.className).toBe('b bla-ccc d')
  })

  it('attribute interpolation: special cases', function () {
    el.innerHTML = '<label for="{{a}}" data-test="{{b}}"></label><form accept-charset="{{c}}"></form>'
    new Braces({
      el: el,
      data: {
        a: 'aaa',
        b: 'bbb',
        c: 'UTF-8'
      }
    })

    // compatible with ie8
    if (_.isIE8) {
      expect(el.innerHTML.replace('\r\n', '').toLowerCase()).toBe('<label for=aaa data-test="bbb"></label><form accept-charset=utf-8></form>')
    } else {
      expect(el.innerHTML).toBe('<label for="aaa" data-test="bbb"></label><form accept-charset="UTF-8"></form>')
    }
  })

  it('attribute interpolation: warn invalid', function () {
    el.innerHTML = '<div v-text="{{a}}"></div>'
    new Braces({
      el: el,
      data: {
        a: '123'
      }
    })
    expect(el.innerHTML.toLowerCase()).toBe('<div></div>')
    expect(_.warn.msg).toContain('attribute interpolation is not allowed in Braces.js directives')
  })

  it('attribute interpolation: warn mixed usage with v-bind', function () {
    el.innerHTML = '<div class="{{a}}" :class="bcd"></div>'
    new Braces({
      el: el,
      data: {
        a: 'foo'
      }
    })
    expect(_.warn.msg).toContain('Do not mix mustache interpolation and v-bind')
  })

  it('should compile custom terminal directive wihtout loop', function () {
    el.innerHTML = '<p v-if="show" v-inject:modal.modifier1="foo">hello world</p>'
    new Braces({
      el: el,
      data: { show: true },
      directives: {
        inject: {
          terminal: true,
          priority: Braces.options.directives.if.priority + 1,
          bind: function () {
            this.anchor = _.createAnchor('v-inject')
            _.replace(this.el, this.anchor)
            var factory = new FragmentFactory(this.vm, this.el)
            this.frag = factory.create(this._host, this._scope, this._frag)
            this.frag.before(this.anchor)
          },
          unbind: function () {
            this.frag.remove()
            _.replace(this.anchor, this.el)
          }
        }
      }
    })
    expect(textContent(el)).toBe('hello world')
  })
})
