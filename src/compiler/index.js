import publicDirectives from '../directives/public/index'
import { parseText, tokensToExp } from '../parsers/text'
import { parseDirective } from '../parsers/directive'
import {
  resolveAsset,
  toArray,
  warn,
  remove,
  replace,
  getAttr,
  arrRemove,
  getWholeText,
  isIE8,
  cloneDomNode,
  previousElementSibling
} from '../util/index'

// special binding prefixes
const bindRE = /^v-bind:|^:/
const onRE = /^v-on:|^@/
const dirAttrRE = /^v-([^:]+)(?:$|:(.*)$)/
const modifierRE = /\.[^\.]+/g

// default directive priority
const DEFAULT_PRIORITY = 1000
const DEFAULT_TERMINAL_PRIORITY = 2000

/**
 * Compile a template and return a reusable composite link
 * function, which recursively contains more link functions
 * inside. This top level compile function would normally
 * be called on instance root nodes, but can also be used
 * for partial compilation if the partial argument is true.
 *
 * The returned composite link function, when called, will
 * return an unlink function that tearsdown all directives
 * created during the linking phase.
 *
 * @param {Element|DocumentFragment} el
 * @param {Object} options
 * @return {Function}
 */

export function compile (el, options) {
  // link function for the node itself.
  var nodeLinkFn = compileNode(el, options)
  // link function for the childNodes
  var childLinkFn =
    !(nodeLinkFn && nodeLinkFn.terminal) &&
    !isScript(el) &&
    el.hasChildNodes()
      ? compileNodeList(el.childNodes, options)
      : null

  /**
   * A composite linker function to be called on a already
   * compiled piece of DOM, which instantiates all directive
   * instances.
   *
   * @param {Braces} vm
   * @param {Element|DocumentFragment} el
   * @param {Object} [scope] - v-for scope
   * @param {Fragment} [frag] - link context fragment
   * @return {Function|undefined}
   */

  return function compositeLinkFn (vm, el, scope, frag) {
    // cache childNodes before linking parent, fix #657
    var childNodes = toArray(el.childNodes)
    // link
    var dirs = linkAndCapture(function compositeLinkCapturer () {
      if (nodeLinkFn) nodeLinkFn(vm, el, scope, frag)
      if (childLinkFn) childLinkFn(vm, childNodes, scope, frag)
    }, vm)
    return makeUnlinkFn(vm, dirs)
  }
}

/**
 * Apply a linker to a vm/element pair and capture the
 * directives created during the process.
 *
 * @param {Function} linker
 * @param {Braces} vm
 */

function linkAndCapture (linker, vm) {
  /* istanbul ignore if */
  if (process.env.NODE_ENV === 'production') {
    // reset directives before every capture in production
    // mode, so that when unlinking we don't need to splice
    // them out (which turns out to be a perf hit).
    // they are kept in development mode because they are
    // useful for Braces's own tests.
    vm._directives = []
  }
  var originalDirCount = vm._directives.length
  linker()
  var dirs = vm._directives.slice(originalDirCount)
  dirs.sort(directiveComparator)
  for (var i = 0, l = dirs.length; i < l; i++) {
    dirs[i]._bind()
  }
  return dirs
}

/**
 * Directive priority sort comparator
 *
 * @param {Object} a
 * @param {Object} b
 */

function directiveComparator (a, b) {
  a = a.descriptor.def.priority || DEFAULT_PRIORITY
  b = b.descriptor.def.priority || DEFAULT_PRIORITY
  return a > b ? -1 : a === b ? 0 : 1
}

/**
 * Linker functions return an unlink function that
 * tearsdown all directives instances generated during
 * the process.
 *
 * We create unlink functions with only the necessary
 * information to avoid retaining additional closures.
 *
 * @param {Braces} vm
 * @param {Array} dirs
 * @param {Braces} [context]
 * @param {Array} [contextDirs]
 * @return {Function}
 */

function makeUnlinkFn (vm, dirs, context, contextDirs) {
  function unlink (destroying) {
    teardownDirs(vm, dirs, destroying)
    if (context && contextDirs) {
      teardownDirs(context, contextDirs)
    }
  }
  // expose linked directives
  unlink.dirs = dirs
  return unlink
}

/**
 * Teardown partial linked directives.
 *
 * @param {Braces} vm
 * @param {Array} dirs
 * @param {Boolean} destroying
 */

function teardownDirs (vm, dirs, destroying) {
  var i = dirs.length
  while (i--) {
    dirs[i]._teardown()
    if (process.env.NODE_ENV !== 'production' && !destroying) {
      arrRemove(vm._directives, dirs[i])
    }
  }
}

/**
 * Compile a node and return a nodeLinkFn based on the
 * node type.
 *
 * @param {Node} node
 * @param {Object} options
 * @return {Function|null}
 */

function compileNode (node, options) {
  var type = node.nodeType
  if (type === 1 && !isScript(node)) {
    return compileElement(node, options)
  } else if (type === 3 && node.data.trim()) {
    return compileTextNode(node, options)
  } else {
    return null
  }
}

/**
 * Compile an element and return a nodeLinkFn.
 *
 * @param {Element} el
 * @param {Object} options
 * @return {Function|null}
 */

function compileElement (el, options) {
  // preprocess textareas.
  // textarea treats its text content as the initial value.
  // just bind it as an attr directive for value.
  if (el.tagName === 'TEXTAREA') {
    var tokens = parseText(el.value)
    if (tokens) {
      el.setAttribute(':value', tokensToExp(tokens))
      el.value = ''
    }
  }
  var linkFn
  var hasAttrs = el.hasAttributes()
  var attrs = hasAttrs && toArray(el.attributes)
  // check terminal directives (for & if)
  if (hasAttrs) {
    linkFn = checkTerminalDirectives(el, attrs, options)
  }

  // normal directives
  if (!linkFn && hasAttrs) {
    linkFn = compileDirectives(attrs, options)
  }
  return linkFn
}

var TEXT_SKIP_MARK = '__BRACES__TEXT_SKIP_MARK__BRACES__'

/**
 * Compile a textNode and return a nodeLinkFn.
 *
 * @param {TextNode} node
 * @param {Object} options
 * @return {Function|null} textNodeLinkFn
 */

function compileTextNode (node, options) {
  // skip marked text nodes
  if (isIE8 && node.data === TEXT_SKIP_MARK || node._skip) {
    return removeText
  }

  var tokens = parseText(getWholeText(node))
  if (!tokens) {
    return null
  }

  // mark adjacent text nodes as skipped,
  // because we are using node.wholeText to compile
  // all adjacent text nodes together. This fixes
  // issues in IE where sometimes it splits up a single
  // text node into multiple ones.
  var next = node.nextSibling
  while (next && next.nodeType === 3) {
    if (isIE8) {
      next.data = TEXT_SKIP_MARK
    } else {
      next._skip = true
    }

    next = next.nextSibling
  }

  var frag = document.createDocumentFragment()
  var el, token
  for (var i = 0, l = tokens.length; i < l; i++) {
    token = tokens[i]
    el = token.tag
      ? processTextToken(token, options)
      : document.createTextNode(token.value)
    frag.appendChild(el)
  }
  return makeTextNodeLinkFn(tokens, frag, options)
}

/**
 * Linker for an skipped text node.
 *
 * @param {Braces} vm
 * @param {Text} node
 */

function removeText (vm, node) {
  remove(node)
}

/**
 * Process a single text token.
 *
 * @param {Object} token
 * @param {Object} options
 * @return {Node}
 */

function processTextToken (token, options) {
  var el
  if (token.html) {
    el = document.createComment('v-html')
    setTokenType('html')
  } else {
    // IE will clean up empty textNodes during
    // frag.cloneNode(true), so we have to give it
    // something here...
    el = document.createTextNode(' ')
    setTokenType('text')
  }
  function setTokenType (type) {
    if (token.descriptor) return
    var parsed = parseDirective(token.value)
    token.descriptor = {
      name: type,
      def: publicDirectives[type],
      expression: parsed.expression,
      filters: parsed.filters
    }
  }
  return el
}

/**
 * Build a function that processes a textNode.
 *
 * @param {Array<Object>} tokens
 * @param {DocumentFragment} frag
 */

function makeTextNodeLinkFn (tokens, frag) {
  return function textNodeLinkFn (vm, el, scope) {
    var fragClone = cloneDomNode(frag, true)
    var childNodes = toArray(fragClone.childNodes)
    var token, node
    for (var i = 0, l = tokens.length; i < l; i++) {
      token = tokens[i]
      if (token.tag) {
        node = childNodes[i]
        vm._bindDir(token.descriptor, node, scope)
      }
    }
    replace(el, fragClone)
  }
}

/**
 * Compile a node list and return a childLinkFn.
 *
 * @param {NodeList} nodeList
 * @param {Object} options
 * @return {Function|undefined}
 */

function compileNodeList (nodeList, options) {
  var linkFns = []
  var nodeLinkFn, childLinkFn, node
  for (var i = 0, l = nodeList.length; i < l; i++) {
    node = nodeList[i]
    nodeLinkFn = compileNode(node, options)
    childLinkFn =
      !(nodeLinkFn && nodeLinkFn.terminal) &&
      node.tagName !== 'SCRIPT' &&
      node.hasChildNodes()
        ? compileNodeList(node.childNodes, options)
        : null
    linkFns.push(nodeLinkFn, childLinkFn)
  }
  return linkFns.length
    ? makeChildLinkFn(linkFns)
    : null
}

/**
 * Make a child link function for a node's childNodes.
 *
 * @param {Array<Function>} linkFns
 * @return {Function} childLinkFn
 */

function makeChildLinkFn (linkFns) {
  return function childLinkFn (vm, nodes, scope, frag) {
    var node, nodeLinkFn, childrenLinkFn
    for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
      node = nodes[n]
      nodeLinkFn = linkFns[i++]
      childrenLinkFn = linkFns[i++]
      // cache childNodes before linking parent, fix #657
      var childNodes = toArray(node.childNodes)
      if (nodeLinkFn) {
        nodeLinkFn(vm, node, scope, frag)
      }
      if (childrenLinkFn) {
        childrenLinkFn(vm, childNodes, scope, frag)
      }
    }
  }
}

/**
 * Check an element for terminal directives in fixed order.
 * If it finds one, return a terminal link function.
 *
 * @param {Element} el
 * @param {Array} attrs
 * @param {Object} options
 * @return {Function} terminalLinkFn
 */

function checkTerminalDirectives (el, attrs, options) {
  // skip v-pre
  if (getAttr(el, 'v-pre') !== null) {
    return skip
  }
  // skip v-else block, but only if following v-if
  if (el.hasAttribute('v-else')) {
    var prev = previousElementSibling(el)
    if (prev && prev.hasAttribute('v-if')) {
      return skip
    }
  }

  var attr, name, value, modifiers, matched, dirName, rawName, arg, def, termDef
  for (var i = 0, j = attrs.length; i < j; i++) {
    attr = attrs[i]
    name = attr.name.replace(modifierRE, '')
    if ((matched = name.match(dirAttrRE))) {
      def = resolveAsset(options, 'directives', matched[1])
      if (def && def.terminal) {
        if (!termDef || ((def.priority || DEFAULT_TERMINAL_PRIORITY) > termDef.priority)) {
          termDef = def
          rawName = attr.name
          modifiers = parseModifiers(attr.name)
          value = attr.value
          dirName = matched[1]
          arg = matched[2]
        }
      }
    }
  }

  if (termDef) {
    return makeTerminalNodeLinkFn(el, dirName, value, options, termDef, rawName, arg, modifiers)
  }
}

function skip () {}
skip.terminal = true

/**
 * Build a node link function for a terminal directive.
 * A terminal link function terminates the current
 * compilation recursion and handles compilation of the
 * subtree in the directive.
 *
 * @param {Element} el
 * @param {String} dirName
 * @param {String} value
 * @param {Object} options
 * @param {Object} def
 * @param {String} [rawName]
 * @param {String} [arg]
 * @param {Object} [modifiers]
 * @return {Function} terminalLinkFn
 */

function makeTerminalNodeLinkFn (el, dirName, value, options, def, rawName, arg, modifiers) {
  var parsed = parseDirective(value)
  var descriptor = {
    name: dirName,
    arg: arg,
    expression: parsed.expression,
    raw: value,
    attr: rawName,
    modifiers: modifiers,
    def: def
  }
  var fn = function terminalNodeLinkFn (vm, el, scope, frag) {
    vm._bindDir(descriptor, el, scope, frag)
  }
  fn.terminal = true
  return fn
}

/**
 * Compile the directives on an element and return a linker.
 *
 * @param {Array|NamedNodeMap} attrs
 * @param {Object} options
 * @return {Function}
 */

function compileDirectives (attrs, options) {
  var i = attrs.length
  var dirs = []
  var attr, name, value, rawName, rawValue, dirName, arg, modifiers, dirDef, tokens, matched
  while (i--) {
    attr = attrs[i]
    name = rawName = attr.name
    value = rawValue = attr.value
    tokens = parseText(value)
    // reset arg
    arg = null
    // check modifiers
    modifiers = parseModifiers(name)
    name = name.replace(modifierRE, '')

    // attribute interpolations
    if (tokens) {
      value = tokensToExp(tokens)
      arg = name
      pushDir('bind', publicDirectives.bind, tokens)
      // warn against mixing mustaches with v-bind
      if (process.env.NODE_ENV !== 'production') {
        if (name === 'class' && Array.prototype.some.call(attrs, function (attr) {
          return attr.name === ':class' || attr.name === 'v-bind:class'
        })) {
          warn(
            'class="' + rawValue + '": Do not mix mustache interpolation ' +
            'and v-bind for "class" on the same element. Use one or the other.',
            options
          )
        }
      }
    } else

    if (onRE.test(name)) {
      arg = name.replace(onRE, '')
      pushDir('on', publicDirectives.on)
    } else

    // attribute bindings
    if (bindRE.test(name)) {
      dirName = name.replace(bindRE, '')
      arg = dirName
      pushDir('bind', publicDirectives.bind)
    } else

    // normal directives
    if ((matched = name.match(dirAttrRE))) {
      dirName = matched[1]
      arg = matched[2]

      // skip v-else (when used with v-show)
      if (dirName === 'else') {
        continue
      }

      dirDef = resolveAsset(options, 'directives', dirName, true)
      if (dirDef) {
        pushDir(dirName, dirDef)
      }
    }
  }

  /**
   * Push a directive.
   *
   * @param {String} dirName
   * @param {Object|Function} def
   * @param {Array} [interpTokens]
   */

  function pushDir (dirName, def, interpTokens) {
    var parsed = parseDirective(value)
    dirs.push({
      name: dirName,
      attr: rawName,
      raw: rawValue,
      def: def,
      arg: arg,
      modifiers: modifiers,
      // conversion from interpolation strings with one-time token
      // to expression is differed until directive bind time so that we
      // have access to the actual vm context for one-time bindings.
      expression: parsed && parsed.expression,
      interp: interpTokens
    })
  }

  if (dirs.length) {
    return makeNodeLinkFn(dirs)
  }
}

/**
 * Parse modifiers from directive attribute name.
 *
 * @param {String} name
 * @return {Object}
 */

function parseModifiers (name) {
  var res = Object.create(null)
  var match = name.match(modifierRE)
  if (match) {
    var i = match.length
    while (i--) {
      res[match[i].slice(1)] = true
    }
  }
  return res
}

/**
 * Build a link function for all directives on a single node.
 *
 * @param {Array} directives
 * @return {Function} directivesLinkFn
 */

function makeNodeLinkFn (directives) {
  return function nodeLinkFn (vm, el, scope, frag) {
    // reverse apply because it's sorted low to high
    var i = directives.length
    while (i--) {
      vm._bindDir(directives[i], el, scope, frag)
    }
  }
}

function isScript (el) {
  return el.tagName === 'SCRIPT' && (
    !el.hasAttribute('type') ||
    el.getAttribute('type') === 'text/javascript'
  )
}
