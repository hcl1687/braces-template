import config from '../config'
import { isIE8, isIE9 } from './env'
import { warn } from './debug'
import { camelize } from './lang'

/**
 * Query an element selector if it's not an element already.
 *
 * @param {String|Element} el
 * @return {Element}
 */

export function query (el) {
  if (typeof el === 'string') {
    var selector = el
    el = document.querySelector(el)
    if (!el) {
      process.env.NODE_ENV !== 'production' && warn(
        'Cannot find element: ' + selector
      )
    }
  }
  return el
}

/**
 * Check if a node is in the document.
 * Note: document.documentElement.contains should work here
 * but always returns false for comment nodes in phantomjs,
 * making unit tests difficult. This is fixed by doing the
 * contains() check on the node's parentNode instead of
 * the node itself.
 *
 * @param {Node} node
 * @return {Boolean}
 */

export function inDoc (node) {
  if (!node) return false
  var doc = node.ownerDocument.documentElement
  var parent = node.parentNode
  return doc === node ||
    doc === parent ||
    !!(parent && parent.nodeType === 1 && (doc.contains(parent)))
}

/**
 * Get and remove an attribute from a node.
 *
 * @param {Node} node
 * @param {String} _attr
 */

export function getAttr (node, _attr) {
  var val = node.getAttribute(_attr)
  if (val !== null) {
    node.removeAttribute(_attr)
  }
  return val
}

/**
 * Get an attribute with colon or v-bind: prefix.
 *
 * @param {Node} node
 * @param {String} name
 * @return {String|null}
 */

export function getBindAttr (node, name) {
  var val = getAttr(node, ':' + name)
  if (val === null) {
    val = getAttr(node, 'v-bind:' + name)
  }
  return val
}

/**
 * Check the presence of a bind attribute.
 *
 * @param {Node} node
 * @param {String} name
 * @return {Boolean}
 */

export function hasBindAttr (node, name) {
  return node.hasAttribute(name) ||
    node.hasAttribute(':' + name) ||
    node.hasAttribute('v-bind:' + name)
}

/**
 * Insert el before target
 *
 * @param {Element} el
 * @param {Element} target
 */

export function before (el, target) {
  target.parentNode.insertBefore(el, target)
}

/**
 * Insert el after target
 *
 * @param {Element} el
 * @param {Element} target
 */

export function after (el, target) {
  if (target.nextSibling) {
    before(el, target.nextSibling)
  } else {
    target.parentNode.appendChild(el)
  }
}

/**
 * Remove el from DOM
 *
 * @param {Element} el
 */

export function remove (el) {
  el.parentNode.removeChild(el)
}

/**
 * Prepend el to target
 *
 * @param {Element} el
 * @param {Element} target
 */

export function prepend (el, target) {
  if (target.firstChild) {
    before(el, target.firstChild)
  } else {
    target.appendChild(el)
  }
}

/**
 * Replace target with el
 *
 * @param {Element} target
 * @param {Element} el
 */

export function replace (target, el) {
  var parent = target.parentNode
  if (parent) {
    parent.replaceChild(el, target)
  }
}

/**
 * Add event listener shorthand.
 *
 * @param {Element} el
 * @param {String} event
 * @param {Function} cb
 * @param {Boolean} [useCapture]
 */

export function on (el, event, cb, useCapture) {
  if (el.addEventListener) {
    el.addEventListener(event, cb, useCapture)
  } else {
    el.attachEvent('on' + event, cb)
  }
}

/**
 * Remove event listener shorthand.
 *
 * @param {Element} el
 * @param {String} event
 * @param {Function} cb
 */

export function off (el, event, cb) {
  if (el.removeEventListener) {
    el.removeEventListener(event, cb)
  } else {
    el.detachEvent('on' + event, cb)
  }
}

/**
 * For IE9 compat: when both class and :class are present
 * getAttribute('class') returns wrong value...
 *
 * @param {Element} el
 * @return {String}
 */

function getClass (el) {
  var classname = el.className
  if (typeof classname === 'object') {
    classname = classname.baseVal || ''
  }
  return classname
}

/**
 * In IE9, setAttribute('class') will result in empty class
 * if the element also has the :class attribute; However in
 * PhantomJS, setting `className` does not work on SVG elements...
 * So we have to do a conditional check here.
 *
 * @param {Element} el
 * @param {String} cls
 */

export function setClass (el, cls) {
  /* istanbul ignore if */
  if (isIE9 && !/svg$/.test(el.namespaceURI)) {
    el.className = cls
  } else {
    el.setAttribute('class', cls)
  }
}

/**
 * Add class with compatibility for IE & SVG
 *
 * @param {Element} el
 * @param {String} cls
 */

export function addClass (el, cls) {
  if (el.classList) {
    el.classList.add(cls)
  } else {
    var cur = ' ' + getClass(el) + ' '
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      setClass(el, (cur + cls).trim())
    }
  }
}

/**
 * Remove class with compatibility for IE & SVG
 *
 * @param {Element} el
 * @param {String} cls
 */

export function removeClass (el, cls) {
  if (el.classList) {
    el.classList.remove(cls)
  } else {
    var cur = ' ' + getClass(el) + ' '
    var tar = ' ' + cls + ' '
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ')
    }
    setClass(el, cur.trim())
  }
  if (!el.className) {
    el.removeAttribute('class')
  }
}

/**
 * Extract raw content inside an element into a temporary
 * container div
 *
 * @param {Element} el
 * @param {Boolean} asFragment
 * @return {Element|DocumentFragment}
 */

export function extractContent (el, asFragment) {
  var child
  var rawContent
  /* istanbul ignore if */
  if (isTemplate(el) && isFragment(el.content)) {
    el = el.content
  }
  if (el.hasChildNodes()) {
    trimNode(el)
    rawContent = asFragment
      ? document.createDocumentFragment()
      : document.createElement('div')
    /* eslint-disable no-cond-assign */
    while (child = el.firstChild) {
    /* eslint-enable no-cond-assign */
      rawContent.appendChild(child)
    }
  }
  return rawContent
}

/**
 * Trim possible empty head/tail text and comment
 * nodes inside a parent.
 *
 * @param {Node} node
 */

export function trimNode (node) {
  var child
  /* eslint-disable no-sequences */
  while (child = node.firstChild, isTrimmable(child)) {
    node.removeChild(child)
  }
  while (child = node.lastChild, isTrimmable(child)) {
    node.removeChild(child)
  }
  /* eslint-enable no-sequences */
}

function isTrimmable (node) {
  return node && (
    (node.nodeType === 3 && !node.data.trim()) ||
    node.nodeType === 8
  )
}

/**
 * Check if an element is a template tag.
 * Note if the template appears inside an SVG its tagName
 * will be in lowercase.
 *
 * @param {Element} el
 */

export function isTemplate (el) {
  return el.tagName &&
    (el.tagName.toLowerCase() === 'template' ||
      el.getAttribute('type') === 'text/x-template')
}

/**
 * Create an "anchor" for performing dom insertion/removals.
 * This is used in a number of scenarios:
 * - fragment instance
 * - v-html
 * - v-if
 * - v-for
 * - component
 *
 * @param {String} content
 * @param {Boolean} persist - IE trashes empty textNodes on
 *                            cloneNode(true), so in certain
 *                            cases the anchor needs to be
 *                            non-empty to be persisted in
 *                            templates.
 * @return {Comment|Text}
 */
export function createAnchor (content, persist) {
  var anchor = config.debug
    ? document.createComment(content)
    : document.createTextNode(persist ? ' ' : '')
  if (!isIE8) {
    anchor.__v_anchor = true
  }
  return anchor
}

/**
 * Find a component ref attribute that starts with $.
 *
 * @param {Element} node
 * @return {String|undefined}
 */

var refRE = /^v-ref:/
export function findRef (node) {
  if (node.hasAttributes()) {
    var attrs = node.attributes
    for (var i = 0, l = attrs.length; i < l; i++) {
      var name = attrs[i].name
      if (refRE.test(name)) {
        return camelize(name.replace(refRE, ''))
      }
    }
  }
}

/**
 * Map a function to a range of nodes .
 *
 * @param {Node} node
 * @param {Node} end
 * @param {Function} op
 */

export function mapNodeRange (node, end, op) {
  var next
  while (node !== end) {
    next = node.nextSibling
    op(node)
    node = next
  }
  op(end)
}

/**
 * Remove a range of nodes with transition, store
 * the nodes in a fragment with correct ordering,
 * and call callback when done.
 *
 * @param {Node} start
 * @param {Node} end
 * @param {Braces} vm
 * @param {DocumentFragment} frag
 * @param {Function} cb
 */

export function removeNodeRange (start, end, vm, frag, cb) {
  var done = false
  var removed = 0
  var nodes = []
  mapNodeRange(start, end, function (node) {
    if (node === end) done = true
    nodes.push(node)
    onRemoved()
  })
  function onRemoved () {
    removed++
    if (done && removed >= nodes.length) {
      for (var i = 0; i < nodes.length; i++) {
        frag.appendChild(nodes[i])
      }
      cb && cb()
    }
  }
}

/**
 * Check if a node is a DocumentFragment.
 *
 * @param {Node} node
 * @return {Boolean}
 */

export function isFragment (node) {
  return node && node.nodeType === 11
}

/**
 * Get outerHTML of elements, taking care
 * of SVG elements in IE as well.
 *
 * @param {Element} el
 * @return {String}
 */

export function getOuterHTML (el) {
  if (el.outerHTML) {
    return el.outerHTML
  } else {
    var container = document.createElement('div')
    container.appendChild(cloneDomNode(el, true))
    return container.innerHTML
  }
}

/**
 * support ie8
 * @param  {[type]} el [description]
 * @return {[type]}    [description]
 */
export function getWholeText (el) {
  if (el.wholeText) {
    return el.wholeText
  }

  var res = ''
  var previousSibling = el
  while (previousSibling && previousSibling.nodeType === 3) {
    res = previousSibling.data + res
    previousSibling = previousSibling.previousSibling
  }

  var nextSibling = el.nextSibling
  while (nextSibling && nextSibling.nodeType === 3) {
    res += nextSibling.data
    nextSibling = nextSibling.nextSibling
  }

  return res
}

/**
 * support ie8
 * @param  {[type]} el  [description]
 * @param  {[type]} val [description]
 * @return {[type]}     [description]
 */
export function textContent (el, val) {
  // IE8 does not recognize innerHTML or childNodes on script tags
  if (val === undefined) {
    return isIE8
      ? el.tagName === 'SCRIPT'
        ? el.text
        : el.innerText
      : el.textContent
  }

  if (isIE8) {
    if (el.tagName === 'SCRIPT') {
      el.text = val
    } else {
      el.innerText = val
    }
  } else {
    el.textContent = val
  }
}

/**
 * support ie8
 * @param  {[type]} el   [description]
 * @param  {[type]} deep [description]
 * @return {[type]}      [description]
 */
export function cloneDomNode (el, deep) {
  if (!isIE8 || !deep) {
    return el.cloneNode(deep)
  }

  // ie8 deep clone
  return deepClone(el)

  function deepClone (el) {
    var clone = el.nodeType === 3 ? document.createTextNode(el.nodeValue)
      : el.cloneNode(false)

    if (el.tagName === 'SCRIPT') {
      textContent(clone, textContent(el))
    }

    // Recurse
    var child = el.firstChild
    while (child) {
      clone.appendChild(deepClone(child))
      child = child.nextSibling
    }

    return clone
  }
}

/**
 * support ie8
 * @param  {[type]} el [description]
 * @return {[type]}    [description]
 */
export function nextElementSibling (el) {
  if (!isIE8) {
    return el.nextElementSibling
  }

  var nextSibling = el.nextSibling
  if (!nextSibling) {
    return nextSibling
  }

  while (nextSibling.nodeType === 3 || nextSibling.nodeType === 8) {
    nextSibling = nextSibling.nextSibling
  }

  return nextSibling
}

/**
 * support ie8
 * @param  {[type]} el [description]
 * @return {[type]}    [description]
 */
export function previousElementSibling (el) {
  if (!isIE8) {
    return el.previousElementSibling
  }

  var previousSibling = el.previousSibling
  if (!previousSibling) {
    return previousSibling
  }

  while (previousSibling.nodeType === 3 || previousSibling.nodeType === 8) {
    previousSibling = previousSibling.previousSibling
  }

  return previousSibling
}

export function innerHTML (el, val) {
  if (val === undefined) {
    return el.innerHTML
  }

  if (!isIE8) {
    el.innerHTML = val
    return
  }

  // https://allofetechnical.wordpress.com/2010/05/21/ies-innerhtml-method-with-script-and-style-tags/
  var selector = '__BRACES__INNERHTML_MARK__BRACES__'
  var prefix = '<div class="' + selector + '" style="display:none;">&nbsp;</div>'
  var scriptStyleTagRE = /(<script|<style)/ig
  val = val.replace(scriptStyleTagRE, function ($1) {
    return prefix + $1
  })

  el.innerHTML = val
  // remove prefix
  var marks = el.querySelectorAll('.' + selector)
  for (var i = 0, l = marks.length; i < l; i++) {
    var node = marks[i]
    if (node.parentNode) {
      node.parentNode.removeChild(node)
    }
  }
}
