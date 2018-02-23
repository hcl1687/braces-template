var Vue = require('src')
var _ = require('src/util')
var FragmentFactory = require('src/fragment/factory')
var compiler = require('src/compiler')
var compile = compiler.compile
var publicDirectives = require('src/directives/public')

describe('Compile', function () {
  var vm, el, data, directiveBind, directiveTeardown, bindDirSpy
  beforeEach(function () {
    // We mock vms here so we can assert what the generated
    // linker functions do.
    el = document.createElement('div')
    data = {}
    directiveBind = sinon.spy()
    directiveTeardown = sinon.spy()
    bindDirSpy = sinon.spy()
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
        return (new Vue()).$get(exp)
      }
    }
  })

  it('normal directives', function () {
    el.setAttribute('v-a', 'b')
    el.innerHTML = '<p v-a:hello.a.b="a" v-b="1">hello</p><div v-b.literal="foo"></div>'
    var defA = { priority: 1 }
    var defB = { priority: 2 }
    var options = _.mergeOptions(Vue.options, {
      directives: {
        a: defA,
        b: defB
      }
    })
    var linker = compile(el, options)
    expect(typeof linker).to.equal('function')
    linker(vm, el)
    expect(directiveBind.callCount).to.equal(4)
    expect(bindDirSpy.callCount).to.equal(4)

    // check if we are in firefox, which has different
    // attribute interation order
    var isAttrReversed = el.firstChild.attributes[0].name === 'v-b'

    // 1
    var args = bindDirSpy.getCall(0).args
    expect(args[0].name).to.equal('a')
    expect(args[0].expression).to.equal('b')
    expect(args[0].def).to.equal(defA)
    expect(args[1]).to.equal(el)
    // 2
    args = bindDirSpy.getCall(isAttrReversed ? 2 : 1).args
    expect(args[0].name).to.equal('a')
    expect(args[0].expression).to.equal('a')
    expect(args[0].def).to.equal(defA)
    // args + multiple modifiers
    expect(args[0].arg).to.equal('hello')
    expect(args[0].modifiers.a).to.equal(true)
    expect(args[0].modifiers.b).to.equal(true)
    expect(args[1]).to.equal(el.firstChild)
    // 3 (expression literal)
    args = bindDirSpy.getCall(isAttrReversed ? 1 : 2).args
    expect(args[0].name).to.equal('b')
    expect(args[0].expression).to.equal('1')
    expect(args[0].def).to.equal(defB)
    expect(args[1]).to.equal(el.firstChild)
    // 4 (explicit literal)
    args = bindDirSpy.getCall(3).args
    expect(args[0].name).to.equal('b')
    expect(args[0].expression).to.equal('foo')
    expect(args[0].def).to.equal(defB)
    expect(args[0].modifiers.literal).to.equal(true)
    expect(args[1]).to.equal(el.lastChild)
    // check the priority sorting
    // the "b"s should be called first!
    expect(directiveBind.args[0][0]).to.equal('b')
    expect(directiveBind.args[1][0]).to.equal('b')
    expect(directiveBind.args[2][0]).to.equal('a')
    expect(directiveBind.args[3][0]).to.equal('a')
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

    var linker = compile(el, Vue.options)
    linker(vm, el)
    expect(bindDirSpy.callCount).to.equal(3)

    expects.forEach(function (e, i) {
      var args = bindDirSpy.getCall(i).args
      for (var key in e) {
        expect(args[0][key]).to.equal(e[key])
      }
      expect(args[1]).to.equal(el)
    })
  })

  it('v-on shorthand', function () {
    el.innerHTML = '<div @click="a++"></div>'
    el = el.firstChild
    var linker = compile(el, Vue.options)
    linker(vm, el)
    expect(bindDirSpy.callCount).to.equal(1)
    var args = bindDirSpy.getCall(0).args
    expect(args[0].name).to.equal('on')
    expect(args[0].expression).to.equal('a++')
    expect(args[0].arg).to.equal('click')
    expect(args[0].def).to.equal(publicDirectives.on)
    expect(args[1]).to.equal(el)
  })

  it('text interpolation', function () {
    vm.b = 'yeah'
    el.innerHTML = '{{a}} and {{b}}'
    var def = Vue.options.directives.text
    var linker = compile(el, Vue.options)
    linker(vm, el)
    // expect 1 call because one-time bindings do not generate a directive.
    expect(bindDirSpy.callCount).to.equal(2)
    var args = bindDirSpy.getCall(0).args
    expect(args[0].name).to.equal('text')
    expect(args[0].expression).to.equal('a')
    expect(args[0].def).to.equal(def)
    // bind 被spy替代了。所以不会翻译为最终的结果
    expect(el.innerHTML).to.equal('  and  ')
  })

  it('text interpolation, adjacent nodes', function () {
    vm.b = 'yeah'
    el.appendChild(document.createTextNode('{{a'))
    el.appendChild(document.createTextNode('}} and {{'))
    el.appendChild(document.createTextNode('b}}'))
    var def = Vue.options.directives.text
    var linker = compile(el, Vue.options)
    linker(vm, el)
    // expect 1 call because one-time bindings do not generate a directive.
    expect(bindDirSpy.callCount).to.equal(2)
    var args = bindDirSpy.getCall(0).args
    expect(args[0].name).to.equal('text')
    expect(args[0].expression).to.equal('a')
    expect(args[0].def).to.equal(def)
    // bind 被spy替代了。所以不会翻译为最终的结果
    expect(el.innerHTML).to.equal('  and  ')
  })

  it('adjacent text nodes with no interpolation', function () {
    el.appendChild(document.createTextNode('a'))
    el.appendChild(document.createTextNode('b'))
    el.appendChild(document.createTextNode('c'))
    var linker = compile(el, Vue.options)
    linker(vm, el)
    expect(el.innerHTML).to.equal('abc')
  })

  it('inline html', function () {
    vm.html = '<div>foo</div>'
    el.innerHTML = '{{{html}}} {{{html}}}'
    var htmlDef = Vue.options.directives.html
    var linker = compile(el, Vue.options)
    linker(vm, el)
    expect(bindDirSpy.callCount).to.equal(2)
    var htmlArgs = bindDirSpy.getCall(0).args
    expect(htmlArgs[0].name).to.equal('html')
    expect(htmlArgs[0].expression).to.equal('html')
    expect(htmlArgs[0].def).to.equal(htmlDef)
    // bind 被spy替代了。所以不会翻译为最终的结果
    expect(el.innerHTML).to.equal('<!--v-html--> <!--v-html-->')
  })

  it('terminal directives', function () {
    el.innerHTML =
      '<div v-for="item in items"><p v-a="b"></p></div>' + // v-for
      '<div v-pre><p v-a="b"></p></div>' // v-pre
    var def = Vue.options.directives.for
    var linker = compile(el, Vue.options)
    linker(vm, el)
    // expect 1 call because terminal should return early and let
    // the directive handle the rest.
    expect(bindDirSpy.callCount).to.equal(1)
    var args = bindDirSpy.getCall(0).args
    expect(args[0].name).to.equal('for')
    expect(args[0].expression).to.equal('item in items')
    expect(args[0].def).to.equal(def)
    expect(args[1]).to.equal(el.firstChild)
  })

  it('custom terminal directives', function () {
    var defTerminal = {
      terminal: true,
      priority: Vue.options.directives.if.priority + 1
    }
    var options = _.mergeOptions(Vue.options, {
      directives: { term: defTerminal }
    })
    el.innerHTML = '<div v-term:arg1.modifier1.modifier2="foo"></div>'
    var linker = compile(el, options)
    linker(vm, el)
    expect(bindDirSpy.callCount).to.equal(1)
    var args = bindDirSpy.getCall(0).args
    expect(args[0].name).to.equal('term')
    expect(args[0].expression).to.equal('foo')
    expect(args[0].attr).to.equal('v-term:arg1.modifier1.modifier2')
    expect(args[0].arg).to.equal('arg1')
    expect(args[0].modifiers.modifier1).to.equal(true)
    expect(args[0].modifiers.modifier2).to.equal(true)
    expect(args[0].def).to.equal(defTerminal)
  })

  it('custom terminal directives priority', function () {
    var defTerminal = {
      terminal: true,
      priority: Vue.options.directives.if.priority + 1
    }
    var options = _.mergeOptions(Vue.options, {
      directives: { term: defTerminal }
    })
    el.innerHTML = '<div v-term:arg1 v-if="ok"></div>'
    var linker = compile(el, options)
    linker(vm, el)
    expect(bindDirSpy.callCount).to.equal(1)
    var args = bindDirSpy.getCall(0).args
    expect(args[0].name).to.equal('term')
    expect(args[0].expression).to.equal('')
    expect(args[0].attr).to.equal('v-term:arg1')
    expect(args[0].arg).to.equal('arg1')
    expect(args[0].def).to.equal(defTerminal)
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
    var linker = compile(frag, Vue.options)
    linker(vm, frag)
    expect(el.innerHTML).to.equal(' ')
    expect(el2.innerHTML).to.equal(' ')
  })

  it('partial compilation', function () {
    el.innerHTML = '<div v-bind:test="abc">{{bcd}}<p v-show="ok"></p></div>'
    var linker = compile(el, Vue.options, true)
    var decompile = linker(vm, el)
    expect(vm._directives.length).to.equal(3)
    decompile()
    expect(directiveTeardown.callCount).to.equal(3)
    expect(vm._directives.length).to.equal(0)
  })

  it('skip script tags', function () {
    el.innerHTML = '<script type="x/template">{{test}}</script>'
    var linker = compile(el, Vue.options)
    linker(vm, el)
    expect(bindDirSpy.callCount).to.equal(0)
  })

  it('attribute interpolation', function () {
    el.innerHTML = '<div id="{{a}}" class="b bla-{{c}} d"></div>'
    var vm = new Vue({
      el: el,
      data: {
        a: 'aaa',
        c: 'ccc'
      }
    })
    expect(el.firstChild.id).to.equal('aaa')
    expect(el.firstChild.className).to.equal('b bla-ccc d')
  })

  it('attribute interpolation: special cases', function () {
    el.innerHTML = '<label for="{{a}}" data-test="{{b}}"></label><form accept-charset="{{c}}"></form>'
    new Vue({
      el: el,
      data: {
        a: 'aaa',
        b: 'bbb',
        c: 'UTF-8'
      }
    })
    expect(el.innerHTML).to.equal('<label for="aaa" data-test="bbb"></label><form accept-charset="UTF-8"></form>')
  })

  it('attribute interpolation: warn invalid', function () {
    el.innerHTML = '<div v-text="{{a}}"></div>'
    new Vue({
      el: el,
      data: {
        a: '123'
      }
    })
    expect(el.innerHTML).to.equal('<div></div>')
    expect(_.warn.msg).to.include('attribute interpolation is not allowed in Vue.js directives')
  })

  it('attribute interpolation: warn mixed usage with v-bind', function () {
    el.innerHTML = '<div class="{{a}}" :class="bcd"></div>'
    new Vue({
      el: el,
      data: {
        a: 'foo'
      }
    })
    expect(_.warn.msg).to.include('Do not mix mustache interpolation and v-bind')
  })

  it('should compile custom terminal directive wihtout loop', function () {
    el.innerHTML = '<p v-if="show" v-inject:modal.modifier1="foo">hello world</p>'
    var vm = new Vue({
      el: el,
      data: { show: true },
      directives: {
        inject: {
          terminal: true,
          priority: Vue.options.directives.if.priority + 1,
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
    expect(el.textContent).to.equal('hello world')
  })
})
