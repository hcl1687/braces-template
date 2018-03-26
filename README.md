[![Build](https://img.shields.io/travis/hcl1687/braces-template.svg)](https://travis-ci.org/hcl1687/braces-template)
[![Coverage Status](https://coveralls.io/repos/github/hcl1687/braces-template/badge.svg)](https://coveralls.io/github/hcl1687/braces-template)
[![Sauce Test Status](https://saucelabs.com/buildstatus/hcl1687)](https://saucelabs.com/u/hcl1687)

<p>
  <a href="https://saucelabs.com/u/hcl1687">
    <img src="https://saucelabs.com/browser-matrix/hcl1687.svg" alt="Sauce Test Status"/>
  </a>
</p>

# Braces-template

Braces-template is a Javascript templating engine. It inherits its look from the <a href='https://github.com/vuejs/vue'>Vue.js library</a>. Braces-template does not provide reactive data binding, so it can not sync your changed data to the dom after rendering.

## Big Thanks

### Vue.js

A progressive framework for building user interfaces.

![Vue.js](/img/vue.png)

### Sauce Labs

Cross-browser Testing Platform and Open Source <3 Provided by [Sauce Labs](https://saucelabs.com/)

![Karma Plus Sauce](/img/Sauce-Labs_Horiz_Red-Grey_RGB.png)

## Installation

npm install braces-template --save

## Example

### new
```javascript
import Braces from 'braces-template'

// el = '<div id="app"><div>{{message}}</div></div>'
var el = document.createElement('div')
el.id = 'app'
el.innerHTML = '<div>{{message}}</div>'
document.body.appendChild(el)

var vm = new Braces({
  el: '#app',
  data: {
    message: 'Hello World'
  }
})

// output:
// <div id="app"><div>Hello World</div></div>
expect(textContent(vm.$el).replace(/\r\n/g, '')).toBe('Hello World')
el.parentNode.removeChild(el)
```

### new with template
```javascript
import Braces from 'braces-template'

var el = document.createElement('div')
el.id = 'app'
document.body.appendChild(el)

var vm = new Braces({
  el: '#app',
  template: '<div>{{ message }}</div>',
  data: {
    message: 'Hello World'
  }
})

// output:
// <div id="app"><div>Hello World</div></div>
expect(textContent(vm.$el).replace(/\r\n/g, '')).toBe('Hello World')
el.parentNode.removeChild(el)
```

### v-for
```javascript
import Braces from 'braces-template'

var el = document.createElement('div')
el.id = 'app'
document.body.appendChild(el)

new Braces({
  el: el,
  template: '<div v-for="item in items">{{$index}} {{item.a}}</div>',
  data: {
    items: [{a: 1}, {a: 2}]
  }
})

expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<div>0 1</div><div>1 2</div>')
el.parentNode.removeChild(el)
```

### v-for nested
```javascript
import Braces from 'braces-template'

var el = document.createElement('div')
el.id = 'app'
document.body.appendChild(el)

new Braces({
  el: el,
  template: '<script type="x/template" v-for="item in items">' +
      '<p v-for="subItem in item.items">{{$index}} {{subItem.a}} {{$parent.$index}} {{item.a}}</p>' +
    '</script>',
  data: {
    items: [
      { items: [{a: 1}, {a: 2}], a: 1 },
      { items: [{a: 3}, {a: 4}], a: 2 }
    ]
  }
})

expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe(
  '<p>0 1 0 1</p><p>1 2 0 1</p>' +
  '<p>0 3 1 2</p><p>1 4 1 2</p>'
)
el.parentNode.removeChild(el)
```

### v-if false
```javascript
import Braces from 'braces-template'

var el = document.createElement('div')
el.id = 'app'
document.body.appendChild(el)

new Braces({
  el: '#app',
  template: '<div v-if="test"><div :a="a"></div></div>',
  data: { test: false, a: 'A' }
})
expect(el.innerHTML).toBe('')
el.parentNode.removeChild(el)
```

### v-if true
```javascript
import Braces from 'braces-template'

var el = document.createElement('div')
el.id = 'app'
document.body.appendChild(el)

new Braces({
  el: el,
  template: '<div v-if="test"><div id="a" :a="a"></div></div>',
  data: { test: true, a: 'A' }
})
// lazy instantitation
if (_.isIE8) {
  expect(el.innerHTML.replace(/\r\n/g, '')).toBe('<DIV><DIV id=a a="A"></DIV></DIV>')
} else {
  expect(el.innerHTML).toBe('<div><div id="a" a="A"></div></div>')
}
expect(el.children[0].children[0].getAttribute('a')).toBe('A')
el.parentNode.removeChild(el)
```

### html
```javascript
import Braces from 'braces-template'

var el = document.createElement('div')
el.id = 'app'
document.body.appendChild(el)

new Braces({
  el: '#app',
  template: '<div>{{{ message }}}</div>',
  data: {
    message: '<div>1234</div><p>234</p>'
  }
})
expect(el.innerHTML.replace(/\r\n/g, '').toLowerCase()).toBe('<div><div>1234</div><p>234</p></div>')
el.parentNode.removeChild(el)
```

## Documentation

## Supported Environments
Braces-template has been designed to work in IE8 and other browsers that are ES5-compliant.

Braces-template need es5-shim and es5-sham in IE8. If you want to run Braces-template in IE8, include <a href='https://github.com/es-shims/es5-shim/blob/master/es5-shim.js'>es5-shim</a> and <a href='https://github.com/es-shims/es5-shim/blob/master/es5-sham.js'>es5-sham</a> into your page first.

### IE8 Caveats
- v-bind 
    - no support bind xlink attribute.
- v-on
    - no support attache an event listener to the iframe element except load event.
    - no support capture mode.
- svg
    - no support svg.
- template tag
    - no support template tag, using `<javascript type="x/template"></script>` instead.
- custom tag
    - no support custom tag
- a.true should be replaced by a['true']
    - true is a keyword in javascript. using dot notaion 'true' will throw an error in IE8.

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) 2018-present Chunlin He