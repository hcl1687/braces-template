import Vue from 'src'
import Directive from 'src/directive'

describe('Directive', function () {
  var el, vm, def
  beforeEach(function () {
    el = document.createElement('div')
    def = {
      params: ['foo', 'keBab'],
      bind: jasmine.createSpy('bind'),
      update: jasmine.createSpy('update'),
      unbind: jasmine.createSpy('unbind')
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
    expect(d.el).toBe(el)
    expect(d.name).toBe('test')
    expect(d.vm).toBe(vm)
    expect(d.expression).toBe('a')
    expect(d.literal).toBe(false)
    // init calls
    expect(def.bind).toHaveBeenCalled()
    expect(def.update).toHaveBeenCalled()
    expect(def.update).toHaveBeenCalledWith(1)
    expect(d._bound).toBe(true)
    // teardown
    d._teardown()
    expect(def.unbind).toHaveBeenCalled()
    expect(d._bound).toBe(false)
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
    expect(d.expression).toBe('a')
    expect(d.bind).toHaveBeenCalled()
    expect(d.update).toHaveBeenCalledWith('a')
  })

  it('function def', () => {
    var d = new Directive({
      name: 'test',
      expression: 'a',
      def: def.update
    }, vm, el)
    d._bind()
    expect(d.update).toBe(def.update)
    expect(def.update).toHaveBeenCalled()
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
    expect(d.params.foo).toBe('hello')
    expect(d.params.keBab).toBe('yo')
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
    expect(d.params.foo).toBe(vm.a)
    expect(d.params.keBab).toBe(123)
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

    expect(vm._directives.length).toBe(3)
    var test = vm._directives.filter(item => item.name === 'test')
    test = test.length > 0 ? test[0] : null
    expect(test.params.foo).toBe(vm.a)
    expect(test.params.keBab).toBe(123)
  })
})
