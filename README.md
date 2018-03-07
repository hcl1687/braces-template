[![Build](https://img.shields.io/travis/hcl1687/braces-template.svg)](https://travis-ci.org/hcl1687/braces-template)
[![Coverage Status](https://coveralls.io/repos/github/hcl1687/braces-template/badge.svg)](https://coveralls.io/github/hcl1687/braces-template)

# Braces-template

Braces-template is a Javascript templating engine. It inherits its look from the <a href='https://github.com/vuejs/vue'>Vue.js library</a> .

## install

npm install braces-template --save

## Example

## Documentation

## Supported Environments
Braces-template has been designed to work in IE8 and other browsers that are ES5-compliant.

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
    - true is a keyworld in javascript. using dot notaion 'true' will throw an error in IE8.

## License
[MIT](https://opensource.org/licenses/mit-license.php)