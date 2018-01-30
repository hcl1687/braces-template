import Vue from 'src'
import Directive from 'src/directive'

describe('Directive', function () {
  var el, vm, def
  beforeEach(function () {
    el = document.createElement('div')
    def = {
      params: ['foo', 'keBab'],
      bind: sinon.spy(),
      update: sinon.spy(),
      unbind: sinon.spy()
    }
    vm = new Vue({
      data: {
        a: 1,
        b: {
          c: {
            d: 2
          }
        }
      },
      directives: {
        test: def
      }
    })
  })

  it('normal', () => {
    var d = new Directive({
      name: 'test',
      def: def,
      expression: 'a',
      modifiers: {
        literal: false
      }
    }, vm, el)
    d._bind()
    // properties
    expect(d.el).to.equal(el)
    expect(d.name).to.equal('test')
    expect(d.vm).to.equal(vm)
    expect(d.expression).to.equal('a')
    expect(d.literal).to.equal(false)
    // init calls
    expect(def.bind.called).to.equal(true)
    expect(def.update.called).to.equal(true)
    expect(def.update.calledWith(1)).to.be.true
    expect(d._bound).to.equal(true)
    // teardown
    d._teardown()
    expect(def.unbind.called).to.equal(true)
    expect(d._bound).to.equal(false)
  })

  it('literal', function () {
    var d = new Directive({
      name: 'test',
      expression: 'a',
      raw: 'a',
      def: def,
      modifiers: {
        literal: true
      }
    }, vm, el)
    d._bind()
    expect(d.expression).to.equal('a')
    expect(d.bind.called).to.equal(true)
    expect(d.update.calledWith('a')).to.be.true
  })

  it('function def', () => {
    var d = new Directive({
      name: 'test',
      expression: 'a',
      def: def.update
    }, vm, el)
    d._bind()
    expect(d.update).to.equal(def.update)
    expect(def.update.called).to.be.true
  })

  it('static params', () => {
    el.setAttribute('foo', 'hello')
    el.setAttribute('ke-bab', 'yo')
    var d = new Directive({
      name: 'test',
      def: def,
      expression: 'a'
    }, vm, el)
    d._bind()
    expect(d.params.foo).to.equal('hello')
    expect(d.params.keBab).to.equal('yo')
  })

  it('dynamic params', () => {
    el.setAttribute(':foo', 'a')
    el.setAttribute(':ke-bab', '123')
    var d = new Directive({
      name: 'test',
      def: def,
      expression: 'a'
    }, vm, el)
    d._bind()
    expect(d.params.foo).to.equal(vm.a)
    expect(d.params.keBab).to.equal(123)
  })

  it('dynamic params another test', () => {
    var str = '<div v-test :foo="1" :ke-bab="123"></div>'
    var div = document.createElement('div')
    div.id = 'test1'
    div.innerHTML = str
    document.body.appendChild(div)
    vm = new Vue({
      el: div,
      data: {
        a: 1,
        b: {
          c: {
            d: 2
          }
        }
      },
      directives: {
        test: def
      }
    })

    expect(vm._directives.length).to.equal(3)
    var test = vm._directives.filter(item => item.name === 'test')
    test = test.length > 0 ? test[0] : null
    expect(test).to.be.an('object')
    expect(test.params.foo).to.equal(vm.a)
    expect(test.params.keBab).to.equal(123)
  })
})
