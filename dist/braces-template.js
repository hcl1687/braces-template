(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Braces"] = factory();
	else
		root["Braces"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _braces = __webpack_require__(1);

	var _braces2 = _interopRequireDefault(_braces);

	var _globalApi = __webpack_require__(38);

	var _globalApi2 = _interopRequireDefault(_globalApi);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	(0, _globalApi2['default'])(_braces2['default']);
	_braces2['default'].version = '1.0.26';

	exports['default'] = _braces2['default'];
	module.exports = exports['default'];

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _init = __webpack_require__(2);

	var _init2 = _interopRequireDefault(_init);

	var _state = __webpack_require__(11);

	var _state2 = _interopRequireDefault(_state);

	var _events = __webpack_require__(12);

	var _events2 = _interopRequireDefault(_events);

	var _lifecycle = __webpack_require__(13);

	var _lifecycle2 = _interopRequireDefault(_lifecycle);

	var _data = __webpack_require__(34);

	var _data2 = _interopRequireDefault(_data);

	var _dom = __webpack_require__(35);

	var _dom2 = _interopRequireDefault(_dom);

	var _events3 = __webpack_require__(36);

	var _events4 = _interopRequireDefault(_events3);

	var _lifecycle3 = __webpack_require__(37);

	var _lifecycle4 = _interopRequireDefault(_lifecycle3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function Braces(options) {
	  this._init(options);
	}

	(0, _init2['default'])(Braces);
	(0, _state2['default'])(Braces);
	(0, _events2['default'])(Braces);
	(0, _lifecycle2['default'])(Braces);

	(0, _data2['default'])(Braces);
	(0, _dom2['default'])(Braces);
	(0, _events4['default'])(Braces);
	(0, _lifecycle4['default'])(Braces);

	exports['default'] = Braces;
	module.exports = exports['default'];

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports['default'] = function (Braces) {

	  Braces.prototype._init = function (options) {
	    options = options || {};

	    this.$el = null;
	    this.$parent = options.parent;
	    this.$root = this.$parent ? this.$parent.$root : this;
	    this.$els = {};
	    this._directives = [];
	    this._uid = uid++;

	    this._isBraces = true;

	    this._events = {};
	    this._isFragment = false;
	    this._fragment = this._fragmentStart = this._fragmentEnd = null;
	    this._isCompiled = this._isDestroyed = this._isReady = this._isAttached = this._isBeingDestroyed = this._vForRemoving = false;
	    this._unlinkFn = null;

	    this._scope = options._scope;

	    this._frag = options._frag;
	    if (this._frag) {
	      this._frag.children.push(this);
	    }

	    options = this.$options = (0, _index.mergeOptions)(this.constructor.options, options, this);

	    this._data = {};

	    this._callHook('init');

	    this._initState();

	    this._initEvents();

	    this._callHook('created');

	    if (options.el) {
	      this.$mount(options.el);
	    }
	  };
	};

	var _index = __webpack_require__(3);

	var uid = 0;

	module.exports = exports['default'];

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _lang = __webpack_require__(4);

	var lang = _interopRequireWildcard(_lang);

	var _env = __webpack_require__(5);

	var env = _interopRequireWildcard(_env);

	var _dom = __webpack_require__(6);

	var dom = _interopRequireWildcard(_dom);

	var _options = __webpack_require__(10);

	var options = _interopRequireWildcard(_options);

	var _debug = __webpack_require__(9);

	var debug = _interopRequireWildcard(_debug);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	exports['default'] = _extends({}, lang, env, dom, options, debug);
	module.exports = exports['default'];

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.hasOwn = hasOwn;
	exports.isLiteral = isLiteral;
	exports.isReserved = isReserved;
	exports._toString = _toString;
	exports.toNumber = toNumber;
	exports.toBoolean = toBoolean;
	exports.stripQuotes = stripQuotes;
	exports.camelize = camelize;
	exports.hyphenate = hyphenate;
	exports.classify = classify;
	exports.bind = bind;
	exports.toArray = toArray;
	exports.extend = extend;
	exports.isObject = isObject;
	exports.isPlainObject = isPlainObject;
	exports.debounce = debounce;
	exports.indexOf = indexOf;
	exports.cancellable = cancellable;
	exports.looseEqual = looseEqual;
	exports.arrRemove = arrRemove;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function hasOwn(obj, key) {
	  return hasOwnProperty.call(obj, key);
	}

	var literalValueRE = /^\s?(true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
	function isLiteral(exp) {
	  return literalValueRE.test(exp);
	}

	function isReserved(str) {
	  var c = (str + '').charCodeAt(0);
	  return c === 0x24 || c === 0x5F;
	}

	function _toString(value) {
	  return value == null ? '' : value.toString();
	}

	function toNumber(value) {
	  if (typeof value !== 'string') {
	    return value;
	  } else {
	    var parsed = Number(value);
	    return isNaN(parsed) ? value : parsed;
	  }
	}

	function toBoolean(value) {
	  return value === 'true' ? true : value === 'false' ? false : value;
	}

	function stripQuotes(str) {
	  var a = str.charCodeAt(0);
	  var b = str.charCodeAt(str.length - 1);
	  return a === b && (a === 0x22 || a === 0x27) ? str.slice(1, -1) : str;
	}

	var camelizeRE = /-(\w)/g;
	function camelize(str) {
	  return str.replace(camelizeRE, toUpper);
	}

	function toUpper(_, c) {
	  return c ? c.toUpperCase() : '';
	}

	var hyphenateRE = /([a-z\d])([A-Z])/g;
	function hyphenate(str) {
	  return str.replace(hyphenateRE, '$1-$2').toLowerCase();
	}

	var classifyRE = /(?:^|[-_/])(\w)/g;
	function classify(str) {
	  return str.replace(classifyRE, toUpper);
	}

	function bind(fn, ctx) {
	  return function (a) {
	    var l = arguments.length;
	    return l ? l > 1 ? fn.apply(ctx, arguments) : fn.call(ctx, a) : fn.call(ctx);
	  };
	}

	function toArray(list, start) {
	  start = start || 0;
	  var i = list.length - start;
	  var ret = new Array(i);
	  while (i--) {
	    ret[i] = list[i + start];
	  }
	  return ret;
	}

	function extend(to, from) {
	  var keys = Object.keys(from);
	  var i = keys.length;
	  while (i--) {
	    to[keys[i]] = from[keys[i]];
	  }
	  return to;
	}

	function isObject(obj) {
	  return obj !== null && (typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object';
	}

	var toString = Object.prototype.toString;
	var OBJECT_STRING = '[object Object]';
	function isPlainObject(obj) {
	  return toString.call(obj) === OBJECT_STRING && obj !== null && obj !== undefined && obj !== window;
	}

	var isArray = exports.isArray = Array.isArray;

	function debounce(func, wait) {
	  var timeout, args, context, timestamp, result;
	  var later = function later() {
	    var last = Date.now() - timestamp;
	    if (last < wait && last >= 0) {
	      timeout = setTimeout(later, wait - last);
	    } else {
	      timeout = null;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    }
	  };
	  return function () {
	    context = this;
	    args = arguments;
	    timestamp = Date.now();
	    if (!timeout) {
	      timeout = setTimeout(later, wait);
	    }
	    return result;
	  };
	}

	function indexOf(arr, obj) {
	  var i = arr.length;
	  while (i--) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	}

	function cancellable(fn) {
	  var cb = function cb() {
	    if (!cb.cancelled) {
	      return fn.apply(this, arguments);
	    }
	  };
	  cb.cancel = function () {
	    cb.cancelled = true;
	  };
	  return cb;
	}

	function looseEqual(a, b) {
	  return a == b || (isObject(a) && isObject(b) ? JSON.stringify(a) === JSON.stringify(b) : false);
	}

	function arrRemove(arr, item) {
	  if (!arr.length) return;
	  var index = indexOf(arr, item);
	  if (index > -1) {
	    return arr.splice(index, 1);
	  }
	}

/***/ }),
/* 5 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var hasProto = exports.hasProto = '__proto__' in {};

	var inBrowser = exports.inBrowser = typeof window !== 'undefined';var devtools = exports.devtools = inBrowser && window.__BRACES_DEVTOOLS_GLOBAL_HOOK__;

	var UA = inBrowser && window.navigator.userAgent.toLowerCase();
	var isIE = exports.isIE = UA && UA.indexOf('trident') > 0;
	var isIE8 = exports.isIE8 = UA && UA.indexOf('msie 8.0') > 0;
	var isIE9 = exports.isIE9 = UA && UA.indexOf('msie 9.0') > 0;
	var isAndroid = exports.isAndroid = UA && UA.indexOf('android') > 0;
	var isIos = exports.isIos = UA && /(iphone|ipad|ipod|ios)/i.test(UA);
	var iosVersionMatch = exports.iosVersionMatch = isIos && UA.match(/os ([\d_]+)/);
	var iosVersion = exports.iosVersion = iosVersionMatch && iosVersionMatch[1].split('_');

	var hasMutationObserverBug = exports.hasMutationObserverBug = iosVersion && Number(iosVersion[0]) >= 9 && Number(iosVersion[1]) >= 3 && !window.indexedDB;

	var transitionProp = void 0;
	var transitionEndEvent = void 0;
	var animationProp = void 0;
	var animationEndEvent = void 0;

	if (inBrowser && !isIE9) {
	  var isWebkitTrans = window.ontransitionend === undefined && window.onwebkittransitionend !== undefined;
	  var isWebkitAnim = window.onanimationend === undefined && window.onwebkitanimationend !== undefined;
	  exports.transitionProp = transitionProp = isWebkitTrans ? 'WebkitTransition' : 'transition';
	  exports.transitionEndEvent = transitionEndEvent = isWebkitTrans ? 'webkitTransitionEnd' : 'transitionend';
	  exports.animationProp = animationProp = isWebkitAnim ? 'WebkitAnimation' : 'animation';
	  exports.animationEndEvent = animationEndEvent = isWebkitAnim ? 'webkitAnimationEnd' : 'animationend';
	}

	exports.transitionProp = transitionProp;
	exports.transitionEndEvent = transitionEndEvent;
	exports.animationProp = animationProp;
	exports.animationEndEvent = animationEndEvent;
	var nextTick = exports.nextTick = function () {
	  var callbacks = [];
	  var pending = false;
	  var timerFunc;
	  function nextTickHandler() {
	    pending = false;
	    var copies = callbacks.slice(0);
	    callbacks = [];
	    for (var i = 0; i < copies.length; i++) {
	      copies[i]();
	    }
	  }

	  if (typeof MutationObserver !== 'undefined' && !hasMutationObserverBug) {
	    var counter = 1;
	    var observer = new MutationObserver(nextTickHandler);
	    var textNode = document.createTextNode(counter);
	    observer.observe(textNode, {
	      characterData: true
	    });
	    timerFunc = function timerFunc() {
	      counter = (counter + 1) % 2;
	      textNode.data = counter;
	    };
	  } else {
	    var context = inBrowser ? window : typeof global !== 'undefined' ? global : {};
	    timerFunc = context.setImmediate || setTimeout;
	  }
	  return function (cb, ctx) {
	    var func = ctx ? function () {
	      cb.call(ctx);
	    } : cb;
	    callbacks.push(func);
	    if (pending) return;
	    pending = true;
	    timerFunc(nextTickHandler, 0);
	  };
	}();

	var _Set = void 0;

	if (typeof Set !== 'undefined' && Set.toString().match(/native code/)) {
	  exports._Set = _Set = Set;
	} else {
	  exports._Set = _Set = function _Set() {
	    this.set = Object.create(null);
	  };
	  _Set.prototype.has = function (key) {
	    return this.set[key] !== undefined;
	  };
	  _Set.prototype.add = function (key) {
	    this.set[key] = 1;
	  };
	  _Set.prototype.clear = function () {
	    this.set = Object.create(null);
	  };
	}

	exports._Set = _Set;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports.query = query;
	exports.inDoc = inDoc;
	exports.getAttr = getAttr;
	exports.getBindAttr = getBindAttr;
	exports.hasBindAttr = hasBindAttr;
	exports.before = before;
	exports.after = after;
	exports.remove = remove;
	exports.prepend = prepend;
	exports.replace = replace;
	exports.on = on;
	exports.off = off;
	exports.setClass = setClass;
	exports.addClass = addClass;
	exports.removeClass = removeClass;
	exports.extractContent = extractContent;
	exports.trimNode = trimNode;
	exports.isTemplate = isTemplate;
	exports.createAnchor = createAnchor;
	exports.findRef = findRef;
	exports.mapNodeRange = mapNodeRange;
	exports.removeNodeRange = removeNodeRange;
	exports.isFragment = isFragment;
	exports.getOuterHTML = getOuterHTML;
	exports.getWholeText = getWholeText;
	exports.textContent = textContent;
	exports.cloneDomNode = cloneDomNode;
	exports.nextElementSibling = nextElementSibling;
	exports.previousElementSibling = previousElementSibling;
	exports.innerHTML = innerHTML;

	var _config = __webpack_require__(8);

	var _config2 = _interopRequireDefault(_config);

	var _env = __webpack_require__(5);

	var _debug = __webpack_require__(9);

	var _lang = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function query(el) {
	  if (typeof el === 'string') {
	    var selector = el;
	    el = document.querySelector(el);
	    if (!el) {
	      process.env.NODE_ENV !== 'production' && (0, _debug.warn)('Cannot find element: ' + selector);
	    }
	  }
	  return el;
	}

	function inDoc(node) {
	  if (!node) return false;
	  var doc = node.ownerDocument.documentElement;
	  var parent = node.parentNode;
	  return doc === node || doc === parent || !!(parent && parent.nodeType === 1 && doc.contains(parent));
	}

	function getAttr(node, _attr) {
	  var val = node.getAttribute(_attr);
	  if (val !== null) {
	    node.removeAttribute(_attr);
	  }
	  return val;
	}

	function getBindAttr(node, name) {
	  var val = getAttr(node, ':' + name);
	  if (val === null) {
	    val = getAttr(node, 'v-bind:' + name);
	  }
	  return val;
	}

	function hasBindAttr(node, name) {
	  return node.hasAttribute(name) || node.hasAttribute(':' + name) || node.hasAttribute('v-bind:' + name);
	}

	function before(el, target) {
	  target.parentNode.insertBefore(el, target);
	}

	function after(el, target) {
	  if (target.nextSibling) {
	    before(el, target.nextSibling);
	  } else {
	    target.parentNode.appendChild(el);
	  }
	}

	function remove(el) {
	  el.parentNode.removeChild(el);
	}

	function prepend(el, target) {
	  if (target.firstChild) {
	    before(el, target.firstChild);
	  } else {
	    target.appendChild(el);
	  }
	}

	function replace(target, el) {
	  var parent = target.parentNode;
	  if (parent) {
	    parent.replaceChild(el, target);
	  }
	}

	function on(el, event, cb, useCapture) {
	  if (el.addEventListener) {
	    el.addEventListener(event, cb, useCapture);
	  } else {
	    el.attachEvent('on' + event, cb);
	  }
	}

	function off(el, event, cb) {
	  if (el.removeEventListener) {
	    el.removeEventListener(event, cb);
	  } else {
	    el.detachEvent('on' + event, cb);
	  }
	}

	function getClass(el) {
	  var classname = el.className;
	  if ((typeof classname === 'undefined' ? 'undefined' : _typeof(classname)) === 'object') {
	    classname = classname.baseVal || '';
	  }
	  return classname;
	}

	function setClass(el, cls) {
	  if (_env.isIE9 && !/svg$/.test(el.namespaceURI)) {
	    el.className = cls;
	  } else {
	    el.setAttribute('class', cls);
	  }
	}

	function addClass(el, cls) {
	  if (el.classList) {
	    el.classList.add(cls);
	  } else {
	    var cur = ' ' + getClass(el) + ' ';
	    if (cur.indexOf(' ' + cls + ' ') < 0) {
	      setClass(el, (cur + cls).trim());
	    }
	  }
	}

	function removeClass(el, cls) {
	  if (el.classList) {
	    el.classList.remove(cls);
	  } else {
	    var cur = ' ' + getClass(el) + ' ';
	    var tar = ' ' + cls + ' ';
	    while (cur.indexOf(tar) >= 0) {
	      cur = cur.replace(tar, ' ');
	    }
	    setClass(el, cur.trim());
	  }
	  if (!el.className) {
	    el.removeAttribute('class');
	  }
	}

	function extractContent(el, asFragment) {
	  var child;
	  var rawContent;

	  if (isTemplate(el) && isFragment(el.content)) {
	    el = el.content;
	  }
	  if (el.hasChildNodes()) {
	    trimNode(el);
	    rawContent = asFragment ? document.createDocumentFragment() : document.createElement('div');

	    while (child = el.firstChild) {
	      rawContent.appendChild(child);
	    }
	  }
	  return rawContent;
	}

	function trimNode(node) {
	  var child;

	  while (child = node.firstChild, isTrimmable(child)) {
	    node.removeChild(child);
	  }
	  while (child = node.lastChild, isTrimmable(child)) {
	    node.removeChild(child);
	  }
	}

	function isTrimmable(node) {
	  return node && (node.nodeType === 3 && !node.data.trim() || node.nodeType === 8);
	}

	function isTemplate(el) {
	  return el.tagName && (el.tagName.toLowerCase() === 'template' || el.tagName.toLowerCase() === 'script' && el.type === 'x/template');
	}

	function createAnchor(content, persist) {
	  var anchor = _config2['default'].debug ? document.createComment(content) : document.createTextNode(persist ? ' ' : '');
	  if (!_env.isIE8) {
	    anchor.__v_anchor = true;
	  }
	  return anchor;
	}

	var refRE = /^v-ref:/;
	function findRef(node) {
	  if (node.hasAttributes()) {
	    var attrs = node.attributes;
	    for (var i = 0, l = attrs.length; i < l; i++) {
	      var name = attrs[i].name;
	      if (refRE.test(name)) {
	        return (0, _lang.camelize)(name.replace(refRE, ''));
	      }
	    }
	  }
	}

	function mapNodeRange(node, end, op) {
	  var next;
	  while (node !== end) {
	    next = node.nextSibling;
	    op(node);
	    node = next;
	  }
	  op(end);
	}

	function removeNodeRange(start, end, vm, frag, cb) {
	  var done = false;
	  var removed = 0;
	  var nodes = [];
	  mapNodeRange(start, end, function (node) {
	    if (node === end) done = true;
	    nodes.push(node);
	    onRemoved();
	  });
	  function onRemoved() {
	    removed++;
	    if (done && removed >= nodes.length) {
	      for (var i = 0; i < nodes.length; i++) {
	        frag.appendChild(nodes[i]);
	      }
	      cb && cb();
	    }
	  }
	}

	function isFragment(node) {
	  return node && node.nodeType === 11;
	}

	function getOuterHTML(el) {
	  if (el.outerHTML) {
	    return el.outerHTML;
	  } else {
	    var container = document.createElement('div');
	    container.appendChild(cloneDomNode(el, true));
	    return container.innerHTML;
	  }
	}

	function getWholeText(el) {
	  if (el.wholeText) {
	    return el.wholeText;
	  }

	  var res = '';
	  var previousSibling = el;
	  while (previousSibling && previousSibling.nodeType === 3) {
	    res = previousSibling.data + res;
	    previousSibling = previousSibling.previousSibling;
	  }

	  var nextSibling = el.nextSibling;
	  while (nextSibling && nextSibling.nodeType === 3) {
	    res += nextSibling.data;
	    nextSibling = nextSibling.nextSibling;
	  }

	  return res;
	}

	function textContent(el, val) {
	  if (val === undefined) {
	    return _env.isIE8 ? el.tagName === 'SCRIPT' ? el.text : el.innerText : el.textContent;
	  }

	  if (_env.isIE8) {
	    if (el.tagName === 'SCRIPT') {
	      el.text = val;
	    } else {
	      el.innerText = val;
	    }
	  } else {
	    el.textContent = val;
	  }
	}

	function cloneDomNode(el, deep) {
	  if (!_env.isIE8 || !deep) {
	    return el.cloneNode(deep);
	  }

	  return deepClone(el);

	  function deepClone(el) {
	    var clone = el.nodeType === 3 ? document.createTextNode(el.nodeValue) : el.cloneNode(false);

	    if (el.tagName === 'SCRIPT') {
	      textContent(clone, textContent(el));
	    }

	    var child = el.firstChild;
	    while (child) {
	      clone.appendChild(deepClone(child));
	      child = child.nextSibling;
	    }

	    return clone;
	  }
	}

	function nextElementSibling(el) {
	  if (!_env.isIE8) {
	    return el.nextElementSibling;
	  }

	  var nextSibling = el.nextSibling;
	  if (!nextSibling) {
	    return nextSibling;
	  }

	  while (nextSibling.nodeType === 3 || nextSibling.nodeType === 8) {
	    nextSibling = nextSibling.nextSibling;
	  }

	  return nextSibling;
	}

	function previousElementSibling(el) {
	  if (!_env.isIE8) {
	    return el.previousElementSibling;
	  }

	  var previousSibling = el.previousSibling;
	  if (!previousSibling) {
	    return previousSibling;
	  }

	  while (previousSibling.nodeType === 3 || previousSibling.nodeType === 8) {
	    previousSibling = previousSibling.previousSibling;
	  }

	  return previousSibling;
	}

	function innerHTML(el, val) {
	  if (val === undefined) {
	    return el.innerHTML;
	  }

	  if (!_env.isIE8) {
	    el.innerHTML = val;
	    return;
	  }

	  var selector = '__BRACES__INNERHTML_MARK__BRACES__';
	  var prefix = '<div class="' + selector + '" style="display:none;">&nbsp;</div>';
	  var scriptStyleTagRE = /(<script|<style)/ig;
	  val = val.replace(scriptStyleTagRE, function ($1) {
	    return prefix + $1;
	  });

	  el.innerHTML = val;

	  var marks = el.querySelectorAll('.' + selector);
	  for (var i = 0, l = marks.length; i < l; i++) {
	    var node = marks[i];
	    if (node.parentNode) {
	      node.parentNode.removeChild(node);
	    }
	  }
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var config = {

	  debug: false,

	  silent: false,

	  async: true,

	  warnExpressionErrors: true,

	  devtools: process.env.NODE_ENV !== 'production',

	  _delimitersChanged: true,

	  _assetTypes: ['directive'],

	  _propBindingModes: {
	    ONE_TIME: 2
	  },

	  _maxUpdateCount: 100,

	  delimiters: ['{{', '}}'],
	  unsafeDelimiters: ['{{{', '}}}']
	};

	exports['default'] = config;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.warn = undefined;

	var _config = __webpack_require__(8);

	var _config2 = _interopRequireDefault(_config);

	var _lang = __webpack_require__(4);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _warn = void 0;
	var formatComponentName = void 0;

	if (process.env.NODE_ENV !== 'production') {
	  var hasConsole = typeof console !== 'undefined';

	  exports.warn = _warn = function warn(msg, vm) {
	    if (hasConsole && !_config2['default'].silent) {
	      var res = '[Braces warn]: ' + msg + (vm ? formatComponentName(vm) : '');
	      _warn.msg = res;

	      console.error(res);
	    }
	  };

	  formatComponentName = function formatComponentName(vm) {
	    var name = vm._isBraces ? vm.$options.name : vm.name;
	    return name ? ' (found in component: <' + (0, _lang.hyphenate)(name) + '>)' : '';
	  };
	}

	exports.warn = _warn;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.mergeOptions = mergeOptions;
	exports.resolveAsset = resolveAsset;

	var _config = __webpack_require__(8);

	var _config2 = _interopRequireDefault(_config);

	var _lang = __webpack_require__(4);

	var _debug = __webpack_require__(9);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var strats = _config2['default'].optionMergeStrategies = Object.create(null);

	function mergeData(to, from) {
	  var key, toVal, fromVal;
	  for (key in from) {
	    toVal = to[key];
	    fromVal = from[key];
	    if (!(0, _lang.hasOwn)(to, key)) {
	      to[key] = fromVal;
	    } else if ((0, _lang.isObject)(toVal) && (0, _lang.isObject)(fromVal)) {
	      mergeData(toVal, fromVal);
	    }
	  }
	  return to;
	}

	strats.data = function (parentVal, childVal, vm) {
	  if (!vm) {
	    if (!childVal) {
	      return parentVal;
	    }
	    if (typeof childVal !== 'function') {
	      process.env.NODE_ENV !== 'production' && (0, _debug.warn)('The "data" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);
	      return parentVal;
	    }
	    if (!parentVal) {
	      return childVal;
	    }

	    return function mergedDataFn() {
	      return mergeData(childVal.call(this), parentVal.call(this));
	    };
	  } else if (parentVal || childVal) {
	    return function mergedInstanceDataFn() {
	      var instanceData = typeof childVal === 'function' ? childVal.call(vm) : childVal;
	      var defaultData = typeof parentVal === 'function' ? parentVal.call(vm) : undefined;
	      if (instanceData) {
	        return mergeData(instanceData, defaultData);
	      } else {
	        return defaultData;
	      }
	    };
	  }
	};

	strats.el = function (parentVal, childVal, vm) {
	  if (!vm && childVal && typeof childVal !== 'function') {
	    process.env.NODE_ENV !== 'production' && (0, _debug.warn)('The "el" option should be a function ' + 'that returns a per-instance value in component ' + 'definitions.', vm);
	    return;
	  }
	  var ret = childVal || parentVal;

	  return vm && typeof ret === 'function' ? ret.call(vm) : ret;
	};

	strats.init = strats.created = strats.ready = strats.attached = strats.detached = strats.beforeCompile = strats.compiled = strats.beforeDestroy = strats.destroyed = strats.activate = function (parentVal, childVal) {
	  return childVal ? parentVal ? parentVal.concat(childVal) : (0, _lang.isArray)(childVal) ? childVal : [childVal] : parentVal;
	};

	function mergeAssets(parentVal, childVal) {
	  var res = Object.create(parentVal || null);
	  return childVal ? (0, _lang.extend)(res, guardArrayAssets(childVal)) : res;
	}

	_config2['default']._assetTypes.forEach(function (type) {
	  strats[type + 's'] = mergeAssets;
	});

	strats.events = function (parentVal, childVal) {
	  if (!childVal) return parentVal;
	  if (!parentVal) return childVal;
	  var ret = {};
	  (0, _lang.extend)(ret, parentVal);
	  for (var key in childVal) {
	    var parent = ret[key];
	    var child = childVal[key];
	    if (parent && !(0, _lang.isArray)(parent)) {
	      parent = [parent];
	    }
	    ret[key] = parent ? parent.concat(child) : [child];
	  }
	  return ret;
	};

	strats.methods = function (parentVal, childVal) {
	  if (!childVal) return parentVal;
	  if (!parentVal) return childVal;
	  var ret = Object.create(null);
	  (0, _lang.extend)(ret, parentVal);
	  (0, _lang.extend)(ret, childVal);
	  return ret;
	};

	var defaultStrat = function defaultStrat(parentVal, childVal) {
	  return childVal === undefined ? parentVal : childVal;
	};

	function guardArrayAssets(assets) {
	  if ((0, _lang.isArray)(assets)) {
	    var res = {};
	    var i = assets.length;
	    var asset;
	    while (i--) {
	      asset = assets[i];
	      var id = typeof asset === 'function' ? asset.options && asset.options.name || asset.id : asset.name || asset.id;
	      if (!id) {
	        process.env.NODE_ENV !== 'production' && (0, _debug.warn)('Array-syntax assets must provide a "name" or "id" field.');
	      } else {
	        res[id] = asset;
	      }
	    }
	    return res;
	  }
	  return assets;
	}

	function mergeOptions(parent, child, vm) {
	  var options = {};
	  var key;

	  if (child.mixins) {
	    for (var i = 0, l = child.mixins.length; i < l; i++) {
	      var mixinOptions = child.mixins[i];
	      parent = mergeOptions(parent, mixinOptions, vm);
	    }
	  }
	  for (key in parent) {
	    mergeField(key);
	  }
	  for (key in child) {
	    if (!(0, _lang.hasOwn)(parent, key)) {
	      mergeField(key);
	    }
	  }
	  function mergeField(key) {
	    var strat = strats[key] || defaultStrat;
	    options[key] = strat(parent[key], child[key], vm, key);
	  }
	  return options;
	}

	function resolveAsset(options, type, id, warnMissing) {
	  if (typeof id !== 'string') {
	    return;
	  }
	  var assets = options[type];
	  var camelizedId;
	  var res = assets[id] || assets[camelizedId = (0, _lang.camelize)(id)] || assets[camelizedId.charAt(0).toUpperCase() + camelizedId.slice(1)];
	  if (process.env.NODE_ENV !== 'production' && warnMissing && !res) {
	    (0, _debug.warn)('Failed to resolve ' + type.slice(0, -1) + ': ' + id, options);
	  }
	  return res;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports['default'] = function (Braces) {

	  Braces.prototype._initState = function () {
	    this._initMethods();
	    this._initData();
	  };

	  Braces.prototype._initData = function () {
	    var dataFn = this.$options.data;
	    var data = this._data = dataFn ? dataFn() : {};
	    if (!(0, _index.isPlainObject)(data)) {
	      data = {};
	      process.env.NODE_ENV !== 'production' && (0, _index.warn)('data functions should return an object.', this);
	    }

	    var keys = Object.keys(data);
	    var i, key;
	    i = keys.length;
	    while (i--) {
	      key = keys[i];
	      this._proxy(key);
	    }
	  };

	  Braces.prototype._proxy = function (key) {
	    if (!(0, _index.isReserved)(key)) {
	      this[key] = this._data[key];
	    }
	  };

	  Braces.prototype._unproxy = function (key) {
	    if (!(0, _index.isReserved)(key)) {
	      delete this[key];
	    }
	  };

	  Braces.prototype._initMethods = function () {
	    var methods = this.$options.methods;
	    if (methods) {
	      for (var key in methods) {
	        this[key] = (0, _index.bind)(methods[key], this);
	      }
	    }
	  };
	};

	var _index = __webpack_require__(3);

	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

	exports['default'] = function (Braces) {

	  Braces.prototype._initEvents = function () {
	    var options = this.$options;
	    registerCallbacks(this, '$on', options.events);
	  };

	  function registerCallbacks(vm, action, hash) {
	    if (!hash) return;
	    var handlers, key, i, j;
	    for (key in hash) {
	      handlers = hash[key];
	      if ((0, _index.isArray)(handlers)) {
	        for (i = 0, j = handlers.length; i < j; i++) {
	          register(vm, action, key, handlers[i]);
	        }
	      } else {
	        register(vm, action, key, handlers);
	      }
	    }
	  }

	  function register(vm, action, key, handler) {
	    var type = typeof handler === 'undefined' ? 'undefined' : _typeof(handler);
	    if (type === 'function') {
	      vm[action](key, handler);
	    } else if (type === 'string') {
	      var methods = vm.$options.methods;
	      var method = methods && methods[handler];
	      if (method) {
	        vm[action](key, method);
	      } else {
	        process.env.NODE_ENV !== 'production' && (0, _index.warn)('Unknown method: "' + handler + '" when ' + 'registering callback for ' + action + ': "' + key + '".', vm);
	      }
	    } else if (handler && type === 'object') {
	      register(vm, action, key, handler.handler);
	    }
	  }

	  Braces.prototype._initDOMHooks = function () {
	    this.$on('hook:attached', onAttached);
	    this.$on('hook:detached', onDetached);
	  };

	  function onAttached() {
	    if (!this._isAttached) {
	      this._isAttached = true;
	    }
	  }

	  function onDetached() {
	    if (this._isAttached) {
	      this._isAttached = false;
	    }
	  }

	  Braces.prototype._callHook = function (hook) {
	    this.$emit('pre-hook:' + hook);
	    var handlers = this.$options[hook];
	    if (handlers) {
	      for (var i = 0, j = handlers.length; i < j; i++) {
	        handlers[i].call(this);
	      }
	    }
	    this.$emit('hook:' + hook);
	  };
	};

	var _index = __webpack_require__(3);

	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports['default'] = function (Braces) {

	  Braces.prototype._compile = function (el) {
	    var options = this.$options;

	    this._transclude(el, options);
	    this._initElement(el);

	    if (el.nodeType === 1 && (0, _index.getAttr)(el, 'v-pre') !== null) {
	      return;
	    }

	    var contentUnlinkFn = (0, _index2.compile)(el, options)(this, el);

	    this._unlinkFn = function () {
	      contentUnlinkFn(true);
	    };

	    this._isCompiled = true;
	    this._callHook('compiled');
	  };

	  Braces.prototype._transclude = function (el, options) {
	    if ((0, _index.isTemplate)(el)) {
	      process.env.NODE_ENV !== 'production' && (0, _index.warn)('Do not mount an instance to a <template> tag.');
	      return el;
	    }

	    if (options && options.template) {
	      var frag = (0, _template.parseTemplate)(options.template, true);
	      if (frag) {
	        el.appendChild(frag);
	      }
	    }

	    return el;
	  };

	  Braces.prototype._initElement = function (el) {
	    if (_index.isIE8) {
	      var content = el.innerHTML.toLowerCase();

	      var svgRE = /<svg[^>]*>/;
	      if (svgRE.test(content)) {
	        process.env.NODE_ENV !== 'production' && (0, _index.warn)('Do not use SVG tag. IE8 doesn\'t support SVG.', this);
	      }

	      var templateRE = /<\/template[^>]*/;
	      if (templateRE.test(content)) {
	        process.env.NODE_ENV !== 'production' && (0, _index.warn)('IE8 cannot use `<template id="my-template">`. instead of `<script id="my-template" type="x/template">`', this);
	      }
	    }

	    this.$el = el;
	    this.$el.__braces__ = this;
	    this._callHook('beforeCompile');
	  };

	  Braces.prototype._bindDir = function (descriptor, node, scope, frag) {
	    this._directives.push(new _directive2['default'](descriptor, this, node, scope, frag));
	  };

	  Braces.prototype._destroy = function (remove, deferCleanup) {
	    if (this._isBeingDestroyed) {
	      if (!deferCleanup) {
	        this._cleanup();
	      }
	      return;
	    }

	    var destroyReady;
	    var pendingRemoval;

	    var self = this;

	    var cleanupIfPossible = function cleanupIfPossible() {
	      if (destroyReady && !pendingRemoval && !deferCleanup) {
	        self._cleanup();
	      }
	    };

	    if (remove && this.$el) {
	      pendingRemoval = true;
	      this.$remove(function () {
	        pendingRemoval = false;
	        cleanupIfPossible();
	      });
	    }

	    this._callHook('beforeDestroy');
	    this._isBeingDestroyed = true;

	    if (this._unlinkFn) {
	      this._unlinkFn();
	    }

	    if (this.$el) {
	      this.$el.__braces__ = null;
	    }

	    destroyReady = true;
	    cleanupIfPossible();
	  };

	  Braces.prototype._cleanup = function () {
	    if (this._isDestroyed) {
	      return;
	    }

	    if (this._frag) {
	      (0, _index.arrRemove)(this._frag.children, this);
	    }

	    this.$el = this.$parent = this.$root = this._context = this._scope = this._directives = null;

	    this._isDestroyed = true;
	    this._callHook('destroyed');

	    this.$off();
	  };
	};

	var _directive = __webpack_require__(14);

	var _directive2 = _interopRequireDefault(_directive);

	var _template = __webpack_require__(17);

	var _index = __webpack_require__(3);

	var _index2 = __webpack_require__(18);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports['default'] = Directive;

	var _index = __webpack_require__(3);

	var _config = __webpack_require__(8);

	var _config2 = _interopRequireDefault(_config);

	var _expression = __webpack_require__(15);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	function Directive(descriptor, vm, el, scope, frag) {
	  this.vm = vm;
	  this.el = el;

	  this.descriptor = descriptor;
	  this.name = descriptor.name;
	  this.expression = descriptor.expression;
	  this.arg = descriptor.arg;
	  this.modifiers = descriptor.modifiers;
	  this.literal = this.modifiers && this.modifiers.literal;

	  this._bound = false;
	  this._listeners = null;

	  this._scope = scope;
	  this._frag = frag;

	  if (process.env.NODE_ENV !== 'production' && this.el && this.el.nodeType !== 3) {
	    this.el._braces_directives = this.el._braces_directives || [];
	    this.el._braces_directives.push(this);
	  }
	}

	Directive.prototype._bind = function () {
	  var name = this.name;
	  var descriptor = this.descriptor;

	  if ((name !== 'cloak' || this.vm._isCompiled) && this.el && this.el.removeAttribute) {
	    var attr = descriptor.attr || 'v-' + name;
	    this.el.removeAttribute(attr);
	  }

	  var def = descriptor.def;
	  if (typeof def === 'function') {
	    this.update = def;
	  } else {
	    (0, _index.extend)(this, def);
	  }

	  this._setupParams();

	  if (this.bind) {
	    this.bind();
	  }
	  this._bound = true;

	  if (this.literal) {
	    this.update && this.update(descriptor.raw);
	  } else if ((this.expression || this.modifiers) && this.update && !this._checkStatement()) {
	    var preProcess = this._preProcess ? (0, _index.bind)(this._preProcess, this) : null;
	    var postProcess = this._postProcess ? (0, _index.bind)(this._postProcess, this) : null;

	    var isFn = typeof this.expression === 'function';
	    if (isFn) {
	      this.getter = this.expression;
	      this.setter = undefined;
	    } else {
	      var res = (0, _expression.parseExpression)(this.expression);
	      this.getter = res.get;
	      this.setter = undefined;
	    }

	    var scope = this._scope || this.vm;
	    var value = void 0;
	    try {
	      value = this.getter.call(scope, scope);
	    } catch (e) {
	      if (process.env.NODE_ENV !== 'production' && _config2['default'].warnExpressionErrors) {
	        (0, _index.warn)('Error when evaluating expression ' + '"' + this.expression + '": ' + e.toString(), this.vm);
	      }
	    }

	    if (preProcess) {
	      value = preProcess.call(this, value);
	    }
	    if (postProcess) {
	      value = postProcess.call(this, value);
	    }

	    if (this.afterBind) {
	      this.afterBind();
	    } else if (this.update) {
	      this.update(value);
	    }
	  }
	};

	Directive.prototype._setupParams = function () {
	  if (!this.params) {
	    return;
	  }
	  var params = this.params;

	  this.params = Object.create(null);
	  var i = params.length;
	  var key, val, mappedKey;
	  while (i--) {
	    key = (0, _index.hyphenate)(params[i]);
	    mappedKey = (0, _index.camelize)(key);
	    val = (0, _index.getBindAttr)(this.el, key);
	    if (val != null) {
	      var scope = this._scope || this.vm;
	      this.params[mappedKey] = this._getDynamicValue(scope, val);
	    } else {
	      val = (0, _index.getAttr)(this.el, key);
	      if (val != null) {
	        this.params[mappedKey] = val === '' ? true : val;
	      }
	    }
	  }
	};

	Directive.prototype._getDynamicValue = function (scope, expression) {
	  var getter = (0, _expression.parseExpression)(expression).get;

	  var value = void 0;
	  try {
	    value = getter.call(scope, scope);
	  } catch (e) {
	    if (process.env.NODE_ENV !== 'production' && _config2['default'].warnExpressionErrors) {
	      (0, _index.warn)('Error when evaluating expression ' + '"' + this.expression + '": ' + e.toString(), this.vm);
	    }
	  }

	  return value;
	};

	Directive.prototype._checkStatement = function () {
	  var expression = this.expression;
	  if (expression && this.acceptStatement && !(0, _expression.isSimplePath)(expression)) {
	    var fn = (0, _expression.parseExpression)(expression).get;
	    var scope = this._scope || this.vm;
	    var handler = function handler(e) {
	      scope.$event = e;
	      fn.call(scope, scope);
	      scope.$event = null;
	    };

	    this.update(handler);
	    return true;
	  }
	};

	Directive.prototype.on = function (event, handler, useCapture) {
	  (0, _index.on)(this.el, event, handler, useCapture);(this._listeners || (this._listeners = [])).push([event, handler]);
	};

	Directive.prototype._teardown = function () {
	  if (this._bound) {
	    this._bound = false;
	    if (this.unbind) {
	      this.unbind();
	    }
	    var listeners = this._listeners;
	    var i;
	    if (listeners) {
	      i = listeners.length;
	      while (i--) {
	        (0, _index.off)(this.el, listeners[i][0], listeners[i][1]);
	      }
	    }

	    if (process.env.NODE_ENV !== 'production' && this.el && this.el.nodeType !== 3) {
	      (0, _index.arrRemove)(this.el._braces_directives, this);
	    }
	    this.vm = this.el = this._listeners = null;
	  }
	};
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.parseExpression = parseExpression;
	exports.isSimplePath = isSimplePath;

	var _index = __webpack_require__(3);

	var _cache = __webpack_require__(16);

	var _cache2 = _interopRequireDefault(_cache);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var expressionCache = new _cache2['default'](1000);

	var allowedKeywords = 'Math,Date,this,true,false,null,undefined,Infinity,NaN,' + 'isNaN,isFinite,decodeURI,decodeURIComponent,encodeURI,' + 'encodeURIComponent,parseInt,parseFloat';
	var allowedKeywordsRE = new RegExp('^(' + allowedKeywords.replace(/,/g, '\\b|') + '\\b)');

	var improperKeywords = 'break,case,class,catch,const,continue,debugger,default,' + 'delete,do,else,export,extends,finally,for,function,if,' + 'import,in,instanceof,let,return,super,switch,throw,try,' + 'var,while,with,yield,enum,await,implements,package,' + 'protected,static,interface,private,public';
	var improperKeywordsRE = new RegExp('^(' + improperKeywords.replace(/,/g, '\\b|') + '\\b)');

	var wsRE = /\s/g;
	var newlineRE = /\n/g;
	var saveRE = /[{,]\s*[\w$_]+\s*:|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`)|new |typeof |void /g;
	var restoreRE = /"(\d+)"/g;
	var pathTestRE = /^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;
	var identRE = /[^\w$.](?:[A-Za-z_$][\w$]*)/g;
	var literalValueRE = /^(?:true|false|null|undefined|Infinity|NaN)$/;

	function noop() {}

	var saved = [];

	function save(str, isString) {
	  var i = saved.length;
	  saved[i] = isString ? str.replace(newlineRE, '\\n') : str;
	  return '"' + i + '"';
	}

	function rewrite(raw) {
	  var c = raw.charAt(0);
	  var path = raw.slice(1);
	  if (allowedKeywordsRE.test(path)) {
	    return raw;
	  } else {
	    path = path.indexOf('"') > -1 ? path.replace(restoreRE, restore) : path;
	    return c + 'scope.' + path;
	  }
	}

	function restore(str, i) {
	  return saved[i];
	}

	function compileGetter(exp) {
	  if (improperKeywordsRE.test(exp)) {
	    process.env.NODE_ENV !== 'production' && (0, _index.warn)('Avoid using reserved keywords in expression: ' + exp);
	  }

	  saved.length = 0;

	  var body = exp.replace(saveRE, save).replace(wsRE, '');

	  body = (' ' + body).replace(identRE, rewrite).replace(restoreRE, restore);
	  return makeGetterFn(body);
	}

	function makeGetterFn(body) {
	  try {
	    return new Function('scope', 'return ' + body + ';');
	  } catch (e) {
	    if (process.env.NODE_ENV !== 'production') {
	      if (e.toString().match(/unsafe-eval|CSP/)) {
	        (0, _index.warn)('It seems you are using the default build of Braces.js in an environment ' + 'with Content Security Policy that prohibits unsafe-eval. ' + 'Use the CSP-compliant build instead: ' + 'http://vuejs.org/guide/installation.html#CSP-compliant-build');
	      } else {
	        (0, _index.warn)('Invalid expression. ' + 'Generated function body: ' + body);
	      }
	    }
	    return noop;
	  }
	}

	function parseExpression(exp) {
	  exp = exp.trim();

	  var hit = expressionCache.get(exp);
	  if (hit) {
	    return hit;
	  }
	  var res = { exp: exp };
	  res.get = isSimplePath(exp) && exp.indexOf('[') < 0 ? makeGetterFn('scope.' + exp) : compileGetter(exp);
	  expressionCache.put(exp, res);
	  return res;
	}

	function isSimplePath(exp) {
	  return pathTestRE.test(exp) && !literalValueRE.test(exp) && exp.slice(0, 5) !== 'Math.';
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports["default"] = Cache;
	function Cache(limit) {
	  this.size = 0;
	  this.limit = limit;
	  this.head = this.tail = undefined;
	  this._keymap = Object.create(null);
	}

	var p = Cache.prototype;

	p.put = function (key, value) {
	  var removed;

	  var entry = this.get(key, true);
	  if (!entry) {
	    if (this.size === this.limit) {
	      removed = this.shift();
	    }
	    entry = {
	      key: key
	    };
	    this._keymap[key] = entry;
	    if (this.tail) {
	      this.tail.newer = entry;
	      entry.older = this.tail;
	    } else {
	      this.head = entry;
	    }
	    this.tail = entry;
	    this.size++;
	  }
	  entry.value = value;

	  return removed;
	};

	p.shift = function () {
	  var entry = this.head;
	  if (entry) {
	    this.head = this.head.newer;
	    this.head.older = undefined;
	    entry.newer = entry.older = undefined;
	    this._keymap[entry.key] = undefined;
	    this.size--;
	  }
	  return entry;
	};

	p.get = function (key, returnEntry) {
	  var entry = this._keymap[key];
	  if (entry === undefined) return;
	  if (entry === this.tail) {
	    return returnEntry ? entry : entry.value;
	  }

	  if (entry.newer) {
	    if (entry === this.head) {
	      this.head = entry.newer;
	    }
	    entry.newer.older = entry.older;
	  }
	  if (entry.older) {
	    entry.older.newer = entry.newer;
	  }
	  entry.newer = undefined;
	  entry.older = this.tail;
	  if (this.tail) {
	    this.tail.newer = entry;
	  }
	  this.tail = entry;
	  return returnEntry ? entry : entry.value;
	};
	module.exports = exports["default"];

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.cloneNode = cloneNode;
	exports.parseTemplate = parseTemplate;

	var _cache = __webpack_require__(16);

	var _cache2 = _interopRequireDefault(_cache);

	var _index = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var templateCache = new _cache2['default'](1000);
	var idSelectorCache = new _cache2['default'](1000);

	var map = {
	  efault: [0, '', ''],
	  legend: [1, '<fieldset>', '</fieldset>'],
	  tr: [2, '<table><tbody>', '</tbody></table>'],
	  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>']
	};

	map.td = map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

	map.option = map.optgroup = [1, '<select multiple="multiple">', '</select>'];

	map.thead = map.tbody = map.colgroup = map.caption = map.tfoot = [1, '<table>', '</table>'];

	map.g = map.defs = map.symbol = map.use = map.image = map.text = map.circle = map.ellipse = map.line = map.path = map.polygon = map.polyline = map.rect = [1, '<svg ' + 'xmlns="http://www.w3.org/2000/svg" ' + 'xmlns:xlink="http://www.w3.org/1999/xlink" ' + 'xmlns:ev="http://www.w3.org/2001/xml-events"' + 'version="1.1">', '</svg>'];

	function isRealTemplate(node) {
	  return (0, _index.isTemplate)(node) && (0, _index.isFragment)(node.content);
	}

	var tagRE = /<([\w:-]+)/;
	var entityRE = /&#?\w+?;/;
	var commentRE = /<!--/;

	function stringToFragment(templateString, raw) {
	  var cacheKey = raw ? templateString : templateString.trim();
	  var hit = templateCache.get(cacheKey);
	  if (hit) {
	    return hit;
	  }

	  var frag = document.createDocumentFragment();
	  var tagMatch = templateString.match(tagRE);
	  var entityMatch = entityRE.test(templateString);
	  var commentMatch = commentRE.test(templateString);

	  if (!tagMatch && !entityMatch && !commentMatch) {
	    frag.appendChild(document.createTextNode(templateString));
	  } else {
	    var tag = tagMatch && tagMatch[1];
	    var wrap = map[tag] || map.efault;
	    var depth = wrap[0];
	    var prefix = wrap[1];
	    var suffix = wrap[2];
	    var node = document.createElement('div');

	    (0, _index.innerHTML)(node, prefix + templateString + suffix);
	    while (depth--) {
	      node = node.lastChild;
	    }

	    var child;

	    while (child = node.firstChild) {
	      frag.appendChild(child);
	    }
	  }
	  if (!raw) {
	    (0, _index.trimNode)(frag);
	  }
	  templateCache.put(cacheKey, frag);
	  return frag;
	}

	function nodeToFragment(node) {
	  if (isRealTemplate(node)) {
	    return stringToFragment(node.innerHTML);
	  }

	  if (node.tagName === 'SCRIPT') {
	    return stringToFragment((0, _index.textContent)(node));
	  }

	  var clonedNode = cloneNode(node);
	  var frag = document.createDocumentFragment();
	  var child;

	  while (child = clonedNode.firstChild) {
	    frag.appendChild(child);
	  }
	  (0, _index.trimNode)(frag);
	  return frag;
	}

	var hasBrokenTemplate = function () {
	  if (_index.inBrowser) {
	    var a = document.createElement('div');
	    a.innerHTML = '<template>1</template>';
	    return !(0, _index.cloneDomNode)(a, true).firstChild.innerHTML;
	  } else {
	    return false;
	  }
	}();

	var hasTextareaCloneBug = function () {
	  if (_index.inBrowser) {
	    var t = document.createElement('textarea');
	    t.placeholder = 't';
	    return (0, _index.cloneDomNode)(t, true).value === 't';
	  } else {
	    return false;
	  }
	}();

	function cloneNode(node) {
	  if (!node.querySelectorAll) {
	    return node.cloneNode();
	  }
	  var res = (0, _index.cloneDomNode)(node, true);
	  var i, original, cloned;

	  if (hasBrokenTemplate) {
	    var tempClone = res;
	    if (isRealTemplate(node)) {
	      node = node.content;
	      tempClone = res.content;
	    }
	    original = node.querySelectorAll('template');
	    if (original.length) {
	      cloned = tempClone.querySelectorAll('template');
	      i = cloned.length;
	      while (i--) {
	        cloned[i].parentNode.replaceChild(cloneNode(original[i]), cloned[i]);
	      }
	    }
	  }

	  if (hasTextareaCloneBug) {
	    if (node.tagName === 'TEXTAREA') {
	      res.value = node.value;
	    } else {
	      original = node.querySelectorAll('textarea');
	      if (original.length) {
	        cloned = res.querySelectorAll('textarea');
	        i = cloned.length;
	        while (i--) {
	          cloned[i].value = original[i].value;
	        }
	      }
	    }
	  }
	  return res;
	}

	function parseTemplate(template, shouldClone, raw) {
	  var node, frag;

	  if ((0, _index.isFragment)(template)) {
	    (0, _index.trimNode)(template);
	    return shouldClone ? cloneNode(template) : template;
	  }

	  if (typeof template === 'string') {
	    if (!raw && template.charAt(0) === '#') {
	      frag = idSelectorCache.get(template);
	      if (!frag) {
	        node = document.getElementById(template.slice(1));
	        if (node) {
	          frag = nodeToFragment(node);

	          idSelectorCache.put(template, frag);
	        }
	      }
	    } else {
	      frag = stringToFragment(template, raw);
	    }
	  } else if (template.nodeType) {
	    frag = nodeToFragment(template);
	  }

	  return frag && shouldClone ? cloneNode(frag) : frag;
	}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.compile = compile;

	var _index = __webpack_require__(19);

	var _index2 = _interopRequireDefault(_index);

	var _text = __webpack_require__(32);

	var _directive = __webpack_require__(33);

	var _index3 = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var bindRE = /^v-bind:|^:/;
	var onRE = /^v-on:|^@/;
	var dirAttrRE = /^v-([^:]+)(?:$|:(.*)$)/;
	var modifierRE = /\.[^.]+/g;

	var DEFAULT_PRIORITY = 1000;
	var DEFAULT_TERMINAL_PRIORITY = 2000;

	function compile(el, options) {
	  var nodeLinkFn = compileNode(el, options);

	  var childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && !isScript(el) && el.hasChildNodes() ? compileNodeList(el.childNodes, options) : null;

	  return function compositeLinkFn(vm, el, scope, frag) {
	    var childNodes = (0, _index3.toArray)(el.childNodes);

	    var dirs = linkAndCapture(function compositeLinkCapturer() {
	      if (nodeLinkFn) nodeLinkFn(vm, el, scope, frag);
	      if (childLinkFn) childLinkFn(vm, childNodes, scope, frag);
	    }, vm);
	    return makeUnlinkFn(vm, dirs);
	  };
	}

	function linkAndCapture(linker, vm) {
	  if (process.env.NODE_ENV === 'production') {
	    vm._directives = [];
	  }
	  var originalDirCount = vm._directives.length;
	  linker();
	  var dirs = vm._directives.slice(originalDirCount);
	  dirs.sort(directiveComparator);
	  for (var i = 0, l = dirs.length; i < l; i++) {
	    dirs[i]._bind();
	  }
	  return dirs;
	}

	function directiveComparator(a, b) {
	  a = a.descriptor.def.priority || DEFAULT_PRIORITY;
	  b = b.descriptor.def.priority || DEFAULT_PRIORITY;
	  return a > b ? -1 : a === b ? 0 : 1;
	}

	function makeUnlinkFn(vm, dirs, context, contextDirs) {
	  function unlink(destroying) {
	    teardownDirs(vm, dirs, destroying);
	    if (context && contextDirs) {
	      teardownDirs(context, contextDirs);
	    }
	  }

	  unlink.dirs = dirs;
	  return unlink;
	}

	function teardownDirs(vm, dirs, destroying) {
	  var i = dirs.length;
	  while (i--) {
	    dirs[i]._teardown();
	    if (process.env.NODE_ENV !== 'production' && !destroying) {
	      (0, _index3.arrRemove)(vm._directives, dirs[i]);
	    }
	  }
	}

	function compileNode(node, options) {
	  var type = node.nodeType;
	  if (type === 1 && !isScript(node)) {
	    return compileElement(node, options);
	  } else if (type === 3 && node.data.trim()) {
	    return compileTextNode(node, options);
	  } else {
	    return null;
	  }
	}

	function compileElement(el, options) {
	  if (el.tagName === 'TEXTAREA') {
	    var tokens = (0, _text.parseText)(el.value);
	    if (tokens) {
	      el.setAttribute(':value', (0, _text.tokensToExp)(tokens));
	      el.value = '';
	    }
	  }
	  var linkFn;
	  var hasAttrs = el.hasAttributes();
	  var attrs = hasAttrs && (0, _index3.toArray)(el.attributes);

	  if (hasAttrs) {
	    linkFn = checkTerminalDirectives(el, attrs, options);
	  }

	  if (!linkFn && hasAttrs) {
	    linkFn = compileDirectives(attrs, options);
	  }
	  return linkFn;
	}

	var TEXT_SKIP_MARK = '__BRACES__TEXT_SKIP_MARK__BRACES__';

	function compileTextNode(node, options) {
	  if (_index3.isIE8 && node.data === TEXT_SKIP_MARK || node._skip) {
	    return removeText;
	  }

	  var tokens = (0, _text.parseText)((0, _index3.getWholeText)(node));
	  if (!tokens) {
	    return null;
	  }

	  var next = node.nextSibling;
	  while (next && next.nodeType === 3) {
	    if (_index3.isIE8) {
	      next.data = TEXT_SKIP_MARK;
	    } else {
	      next._skip = true;
	    }

	    next = next.nextSibling;
	  }

	  var frag = document.createDocumentFragment();
	  var el, token;
	  for (var i = 0, l = tokens.length; i < l; i++) {
	    token = tokens[i];
	    el = token.tag ? processTextToken(token, options) : document.createTextNode(token.value);
	    frag.appendChild(el);
	  }
	  return makeTextNodeLinkFn(tokens, frag, options);
	}

	function removeText(vm, node) {
	  (0, _index3.remove)(node);
	}

	function processTextToken(token, options) {
	  var el;
	  if (token.html) {
	    el = document.createComment('v-html');
	    setTokenType('html');
	  } else {
	    el = document.createTextNode(' ');
	    setTokenType('text');
	  }
	  function setTokenType(type) {
	    if (token.descriptor) return;
	    var parsed = (0, _directive.parseDirective)(token.value);
	    token.descriptor = {
	      name: type,
	      def: _index2['default'][type],
	      expression: parsed.expression,
	      filters: parsed.filters
	    };
	  }
	  return el;
	}

	function makeTextNodeLinkFn(tokens, frag) {
	  return function textNodeLinkFn(vm, el, scope) {
	    var fragClone = (0, _index3.cloneDomNode)(frag, true);
	    var childNodes = (0, _index3.toArray)(fragClone.childNodes);
	    var token, node;
	    for (var i = 0, l = tokens.length; i < l; i++) {
	      token = tokens[i];
	      if (token.tag) {
	        node = childNodes[i];
	        vm._bindDir(token.descriptor, node, scope);
	      }
	    }
	    (0, _index3.replace)(el, fragClone);
	  };
	}

	function compileNodeList(nodeList, options) {
	  var linkFns = [];
	  var nodeLinkFn, childLinkFn, node;
	  for (var i = 0, l = nodeList.length; i < l; i++) {
	    node = nodeList[i];
	    nodeLinkFn = compileNode(node, options);
	    childLinkFn = !(nodeLinkFn && nodeLinkFn.terminal) && node.tagName !== 'SCRIPT' && node.hasChildNodes() ? compileNodeList(node.childNodes, options) : null;
	    linkFns.push(nodeLinkFn, childLinkFn);
	  }
	  return linkFns.length ? makeChildLinkFn(linkFns) : null;
	}

	function makeChildLinkFn(linkFns) {
	  return function childLinkFn(vm, nodes, scope, frag) {
	    var node, nodeLinkFn, childrenLinkFn;
	    for (var i = 0, n = 0, l = linkFns.length; i < l; n++) {
	      node = nodes[n];
	      nodeLinkFn = linkFns[i++];
	      childrenLinkFn = linkFns[i++];

	      var childNodes = (0, _index3.toArray)(node.childNodes);
	      if (nodeLinkFn) {
	        nodeLinkFn(vm, node, scope, frag);
	      }
	      if (childrenLinkFn) {
	        childrenLinkFn(vm, childNodes, scope, frag);
	      }
	    }
	  };
	}

	function checkTerminalDirectives(el, attrs, options) {
	  if ((0, _index3.getAttr)(el, 'v-pre') !== null) {
	    return skip;
	  }

	  if (el.hasAttribute('v-else')) {
	    var prev = (0, _index3.previousElementSibling)(el);
	    if (prev && prev.hasAttribute('v-if')) {
	      return skip;
	    }
	  }

	  var attr, name, value, modifiers, matched, dirName, rawName, arg, def, termDef;
	  for (var i = 0, j = attrs.length; i < j; i++) {
	    attr = attrs[i];
	    name = attr.name.replace(modifierRE, '');
	    if (matched = name.match(dirAttrRE)) {
	      def = (0, _index3.resolveAsset)(options, 'directives', matched[1]);
	      if (def && def.terminal) {
	        if (!termDef || (def.priority || DEFAULT_TERMINAL_PRIORITY) > termDef.priority) {
	          termDef = def;
	          rawName = attr.name;
	          modifiers = parseModifiers(attr.name);
	          value = attr.value;
	          dirName = matched[1];
	          arg = matched[2];
	        }
	      }
	    }
	  }

	  if (termDef) {
	    return makeTerminalNodeLinkFn(el, dirName, value, options, termDef, rawName, arg, modifiers);
	  }
	}

	function skip() {}
	skip.terminal = true;

	function makeTerminalNodeLinkFn(el, dirName, value, options, def, rawName, arg, modifiers) {
	  var parsed = (0, _directive.parseDirective)(value);
	  var descriptor = {
	    name: dirName,
	    arg: arg,
	    expression: parsed.expression,
	    raw: value,
	    attr: rawName,
	    modifiers: modifiers,
	    def: def
	  };
	  var fn = function terminalNodeLinkFn(vm, el, scope, frag) {
	    vm._bindDir(descriptor, el, scope, frag);
	  };
	  fn.terminal = true;
	  return fn;
	}

	function compileDirectives(attrs, options) {
	  var i = attrs.length;
	  var dirs = [];
	  var attr, name, value, rawName, rawValue, dirName, arg, modifiers, dirDef, tokens, matched;
	  while (i--) {
	    attr = attrs[i];
	    name = rawName = attr.name;
	    value = rawValue = attr.value;
	    tokens = (0, _text.parseText)(value);

	    arg = null;

	    modifiers = parseModifiers(name);
	    name = name.replace(modifierRE, '');

	    if (tokens) {
	      value = (0, _text.tokensToExp)(tokens);
	      arg = name;
	      pushDir('bind', _index2['default'].bind, tokens);

	      if (process.env.NODE_ENV !== 'production') {
	        if (name === 'class' && Array.prototype.some.call(attrs, function (attr) {
	          return attr.name === ':class' || attr.name === 'v-bind:class';
	        })) {
	          (0, _index3.warn)('class="' + rawValue + '": Do not mix mustache interpolation ' + 'and v-bind for "class" on the same element. Use one or the other.', options);
	        }
	      }
	    } else if (onRE.test(name)) {
	      arg = name.replace(onRE, '');
	      pushDir('on', _index2['default'].on);
	    } else if (bindRE.test(name)) {
	        dirName = name.replace(bindRE, '');
	        arg = dirName;
	        pushDir('bind', _index2['default'].bind);
	      } else if (matched = name.match(dirAttrRE)) {
	          dirName = matched[1];
	          arg = matched[2];

	          if (dirName === 'else') {
	            continue;
	          }

	          dirDef = (0, _index3.resolveAsset)(options, 'directives', dirName, true);
	          if (dirDef) {
	            pushDir(dirName, dirDef);
	          }
	        }
	  }

	  function pushDir(dirName, def, interpTokens) {
	    var parsed = (0, _directive.parseDirective)(value);
	    dirs.push({
	      name: dirName,
	      attr: rawName,
	      raw: rawValue,
	      def: def,
	      arg: arg,
	      modifiers: modifiers,

	      expression: parsed && parsed.expression,
	      interp: interpTokens
	    });
	  }

	  if (dirs.length) {
	    return makeNodeLinkFn(dirs);
	  }
	}

	function parseModifiers(name) {
	  var res = Object.create(null);
	  var match = name.match(modifierRE);
	  if (match) {
	    var i = match.length;
	    while (i--) {
	      res[match[i].slice(1)] = true;
	    }
	  }
	  return res;
	}

	function makeNodeLinkFn(directives) {
	  return function nodeLinkFn(vm, el, scope, frag) {
	    var i = directives.length;
	    while (i--) {
	      vm._bindDir(directives[i], el, scope, frag);
	    }
	  };
	}

	function isScript(el) {
	  return el.tagName === 'SCRIPT' && (!el.hasAttribute('type') || el.getAttribute('type') === 'text/javascript');
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _text = __webpack_require__(20);

	var _text2 = _interopRequireDefault(_text);

	var _html = __webpack_require__(21);

	var _html2 = _interopRequireDefault(_html);

	var _for = __webpack_require__(22);

	var _for2 = _interopRequireDefault(_for);

	var _if = __webpack_require__(26);

	var _if2 = _interopRequireDefault(_if);

	var _show = __webpack_require__(27);

	var _show2 = _interopRequireDefault(_show);

	var _on = __webpack_require__(28);

	var _on2 = _interopRequireDefault(_on);

	var _bind = __webpack_require__(29);

	var _bind2 = _interopRequireDefault(_bind);

	var _el = __webpack_require__(30);

	var _el2 = _interopRequireDefault(_el);

	var _cloak = __webpack_require__(31);

	var _cloak2 = _interopRequireDefault(_cloak);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	exports['default'] = {
	  text: _text2['default'],
	  html: _html2['default'],
	  'for': _for2['default'],
	  'if': _if2['default'],
	  show: _show2['default'],
	  on: _on2['default'],
	  bind: _bind2['default'],
	  el: _el2['default'],
	  cloak: _cloak2['default']
	};
	module.exports = exports['default'];

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _index = __webpack_require__(3);

	exports['default'] = {
	  bind: function bind() {
	    this.attr = this.el.nodeType === 3 ? 'data' : _index.isIE8 ? 'innerText' : 'textContent';
	  },
	  update: function update(value) {
	    this.el[this.attr] = (0, _index._toString)(value);
	  }
	};
	module.exports = exports['default'];

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _template = __webpack_require__(17);

	var _index = __webpack_require__(3);

	exports['default'] = {
	  bind: function bind() {
	    if (this.el.nodeType === 8) {
	      this.nodes = [];

	      this.anchor = (0, _index.createAnchor)('v-html');
	      (0, _index.replace)(this.el, this.anchor);
	    }
	  },
	  update: function update(value) {
	    value = (0, _index._toString)(value);
	    if (this.nodes) {
	      this.swap(value);
	    } else {
	      (0, _index.innerHTML)(this.el, value);
	    }
	  },
	  swap: function swap(value) {
	    var i = this.nodes.length;
	    while (i--) {
	      (0, _index.remove)(this.nodes[i]);
	    }

	    var frag = (0, _template.parseTemplate)(value, true, true);

	    this.nodes = (0, _index.toArray)(frag.childNodes);
	    (0, _index.before)(frag, this.anchor);
	  }
	};
	module.exports = exports['default'];

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _factory = __webpack_require__(23);

	var _factory2 = _interopRequireDefault(_factory);

	var _priorities = __webpack_require__(25);

	var _index = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var uid = 0;

	var vFor = {

	  priority: _priorities.FOR,
	  terminal: true,

	  params: [],

	  bind: function bind() {
	    var inMatch = this.expression.match(/(.*) (?:in|of) (.*)/);
	    if (inMatch) {
	      var itMatch = inMatch[1].match(/\((.*),(.*)\)/);
	      if (itMatch) {
	        this.iterator = itMatch[1].trim();
	        this.alias = itMatch[2].trim();
	      } else {
	        this.alias = inMatch[1].trim();
	      }
	      this.expression = inMatch[2];
	    }

	    if (!this.alias) {
	      process.env.NODE_ENV !== 'production' && (0, _index.warn)('Invalid v-for expression "' + this.descriptor.raw + '": ' + 'alias is required.', this.vm);
	      return;
	    }

	    this.id = '__v-for__' + ++uid;

	    var tag = this.el.tagName;
	    this.isOption = (tag === 'OPTION' || tag === 'OPTGROUP') && this.el.parentNode.tagName === 'SELECT';

	    this.start = (0, _index.createAnchor)('v-for-start');
	    this.end = (0, _index.createAnchor)('v-for-end');
	    (0, _index.replace)(this.el, this.end);
	    (0, _index.before)(this.start, this.end);

	    this.factory = new _factory2['default'](this.vm, this.el);
	  },
	  update: function update(data) {
	    this.diff(data);
	  },
	  diff: function diff(data) {
	    var item = data[0];
	    var convertedFromObject = this.fromObject = (0, _index.isObject)(item) && (0, _index.hasOwn)(item, '$key') && (0, _index.hasOwn)(item, '$value');

	    var frags = this.frags = new Array(data.length);
	    var alias = this.alias;
	    var end = this.end;
	    var init = true;
	    var i, l, frag, key, value;

	    for (i = 0, l = data.length; i < l; i++) {
	      item = data[i];
	      key = convertedFromObject ? item.$key : null;
	      value = convertedFromObject ? item.$value : item;

	      frag = this.create(value, alias, i, key);
	      frag.fresh = !init;
	      frags[i] = frag;
	      frag.before(end);
	    }
	  },
	  create: function create(value, alias, index, key) {
	    var parentScope = this._scope || this.vm;
	    var scope = Object.create(parentScope);
	    scope.$els = Object.create(parentScope.$els);

	    scope.$parent = parentScope;

	    scope.$forContext = this;

	    scope[alias] = value;
	    scope['$index'] = index;
	    if (key) {
	      scope['$key'] = key;
	    } else if (scope.$key) {
	      scope['$key'] = null;
	    }
	    if (this.iterator) {
	      scope[this.iterator] = key !== null ? key : index;
	    }
	    var frag = this.factory.create(scope, this._frag);
	    frag.forId = this.id;
	    return frag;
	  },
	  insert: function insert(frag, prevEl) {
	    var target = prevEl.nextSibling;

	    if (!target) {
	      (0, _index.after)(this.end, prevEl);
	      target = this.end;
	    }
	    frag.before(target);
	  },
	  remove: function remove(frag, index, total, inDocument) {
	    frag.remove();
	  },
	  move: function move(frag, prevEl) {
	    if (!prevEl.nextSibling) {
	      this.end.parentNode.appendChild(this.end);
	    }
	    frag.before(prevEl.nextSibling, false);
	  },
	  _preProcess: function _preProcess(value) {
	    this.rawValue = value;
	    return value;
	  },
	  _postProcess: function _postProcess(value) {
	    if ((0, _index.isArray)(value)) {
	      return value;
	    } else if ((0, _index.isPlainObject)(value)) {
	      var keys = Object.keys(value);
	      var i = keys.length;
	      var res = new Array(i);
	      var key;
	      while (i--) {
	        key = keys[i];
	        res[i] = {
	          $key: key,
	          $value: value[key]
	        };
	      }
	      return res;
	    } else {
	      if (typeof value === 'number' && !isNaN(value)) {
	        value = range(value);
	      }
	      return value || [];
	    }
	  },
	  unbind: function unbind() {
	    if (this.frags) {
	      var i = this.frags.length;
	      var frag;
	      while (i--) {
	        frag = this.frags[i];
	        frag.destroy();
	      }
	      this.frags = [];
	    }
	  }
	};

	function range(n) {
	  var i = -1;
	  var ret = new Array(Math.floor(n));
	  while (++i < n) {
	    ret[i] = i;
	  }
	  return ret;
	}

	exports['default'] = vFor;
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports['default'] = FragmentFactory;

	var _index = __webpack_require__(18);

	var _index2 = __webpack_require__(3);

	var _template = __webpack_require__(17);

	var _fragment = __webpack_require__(24);

	var _fragment2 = _interopRequireDefault(_fragment);

	var _cache = __webpack_require__(16);

	var _cache2 = _interopRequireDefault(_cache);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var linkerCache = new _cache2['default'](5000);

	function FragmentFactory(vm, el) {
	  this.vm = vm;
	  var template;
	  var isString = typeof el === 'string';
	  if (isString || (0, _index2.isTemplate)(el) && !el.hasAttribute('v-if')) {
	    template = (0, _template.parseTemplate)(el, true);
	  } else {
	    template = document.createDocumentFragment();
	    template.appendChild(el);
	  }
	  this.template = template;

	  var linker;
	  var cid = vm.constructor.cid;
	  if (cid > 0) {
	    var cacheId = cid + (isString ? el : (0, _index2.getOuterHTML)(el));
	    linker = linkerCache.get(cacheId);
	    if (!linker) {
	      linker = (0, _index.compile)(template, vm.$options, true);
	      linkerCache.put(cacheId, linker);
	    }
	  } else {
	    linker = (0, _index.compile)(template, vm.$options, true);
	  }
	  this.linker = linker;
	}

	FragmentFactory.prototype.create = function (scope, parentFrag) {
	  var frag = (0, _template.cloneNode)(this.template);
	  return new _fragment2['default'](this.linker, this.vm, frag, scope, parentFrag);
	};
	module.exports = exports['default'];

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports['default'] = Fragment;

	var _index = __webpack_require__(3);

	function Fragment(linker, vm, frag, scope, parentFrag) {
	  this.children = [];
	  this.childFrags = [];
	  this.vm = vm;
	  this.scope = scope;
	  this.inserted = false;
	  this.parentFrag = parentFrag;
	  if (parentFrag) {
	    parentFrag.childFrags.push(this);
	  }
	  this.unlink = linker(vm, frag, scope, this);
	  var single = this.single = frag.childNodes.length === 1 && !frag.childNodes[0].__v_anchor;
	  if (single) {
	    this.node = frag.childNodes[0];
	    this.before = singleBefore;
	    this.remove = singleRemove;
	  } else {
	    this.node = (0, _index.createAnchor)('fragment-start');
	    this.end = (0, _index.createAnchor)('fragment-end');
	    this.frag = frag;
	    (0, _index.prepend)(this.node, frag);
	    frag.appendChild(this.end);
	    this.before = multiBefore;
	    this.remove = multiRemove;
	  }
	  if (!_index.isIE8) {
	    this.node.__v_frag = this;
	  }
	}

	Fragment.prototype.callHook = function (hook) {
	  var i, l;
	  for (i = 0, l = this.childFrags.length; i < l; i++) {
	    this.childFrags[i].callHook(hook);
	  }
	  for (i = 0, l = this.children.length; i < l; i++) {
	    hook(this.children[i]);
	  }
	};

	function singleBefore(target) {
	  this.inserted = true;
	  var method = _index.before;
	  method(this.node, target, this.vm);
	  if ((0, _index.inDoc)(this.node)) {
	    this.callHook(attach);
	  }
	}

	function singleRemove() {
	  this.inserted = false;
	  var shouldCallRemove = (0, _index.inDoc)(this.node);
	  this.beforeRemove();
	  (0, _index.remove)(this.node);
	  if (shouldCallRemove) {
	    this.callHook(detach);
	  }
	  this.destroy();
	}

	function multiBefore(target) {
	  this.inserted = true;
	  var vm = this.vm;
	  var method = _index.before;
	  (0, _index.mapNodeRange)(this.node, this.end, function (node) {
	    method(node, target, vm);
	  });
	  if ((0, _index.inDoc)(this.node)) {
	    this.callHook(attach);
	  }
	}

	function multiRemove() {
	  this.inserted = false;
	  var self = this;
	  var shouldCallRemove = (0, _index.inDoc)(this.node);
	  this.beforeRemove();
	  (0, _index.removeNodeRange)(this.node, this.end, this.vm, this.frag, function () {
	    if (shouldCallRemove) {
	      self.callHook(detach);
	    }
	    self.destroy();
	  });
	}

	Fragment.prototype.beforeRemove = function () {
	  var i, l;
	  for (i = 0, l = this.childFrags.length; i < l; i++) {
	    this.childFrags[i].beforeRemove(false);
	  }
	  for (i = 0, l = this.children.length; i < l; i++) {
	    this.children[i].$destroy(false, true);
	  }
	};

	Fragment.prototype.destroy = function () {
	  if (this.parentFrag) {
	    (0, _index.arrRemove)(this.parentFrag.childFrags, this);
	  }
	  if (!_index.isIE8) {
	    this.node.__v_frag = null;
	  }
	  this.unlink();
	};

	function attach(child) {
	  if (!child._isAttached && (0, _index.inDoc)(child.$el)) {
	    child._callHook('attached');
	  }
	}

	function detach(child) {
	  if (child._isAttached && !(0, _index.inDoc)(child.$el)) {
	    child._callHook('detached');
	  }
	}
	module.exports = exports['default'];

/***/ }),
/* 25 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var ON = exports.ON = 700;
	var MODEL = exports.MODEL = 800;
	var BIND = exports.BIND = 850;
	var TRANSITION = exports.TRANSITION = 1100;
	var EL = exports.EL = 1500;
	var COMPONENT = exports.COMPONENT = 1500;
	var PARTIAL = exports.PARTIAL = 1750;
	var IF = exports.IF = 2100;
	var FOR = exports.FOR = 2200;
	var SLOT = exports.SLOT = 2300;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _factory = __webpack_require__(23);

	var _factory2 = _interopRequireDefault(_factory);

	var _priorities = __webpack_require__(25);

	var _index = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	exports['default'] = {

	  priority: _priorities.IF,
	  terminal: true,

	  bind: function bind() {
	    var el = this.el;
	    if (!el.__braces__) {
	      var next = (0, _index.nextElementSibling)(el);
	      if (next && (0, _index.getAttr)(next, 'v-else') !== null) {
	        (0, _index.remove)(next);
	        this.elseEl = next;
	      }

	      this.anchor = (0, _index.createAnchor)('v-if');
	      (0, _index.replace)(el, this.anchor);
	    } else {
	      process.env.NODE_ENV !== 'production' && (0, _index.warn)('v-if="' + this.expression + '" cannot be ' + 'used on an instance root element.', this.vm);
	      this.invalid = true;
	    }
	  },
	  update: function update(value) {
	    if (this.invalid) return;
	    if (value) {
	      if (!this.frag) {
	        this.insert();
	      }
	    } else {
	      this.remove();
	    }
	  },
	  insert: function insert() {
	    if (this.elseFrag) {
	      this.elseFrag.remove();
	      this.elseFrag = null;
	    }

	    if (!this.factory) {
	      this.factory = new _factory2['default'](this.vm, this.el);
	    }
	    this.frag = this.factory.create(this._scope, this._frag);
	    this.frag.before(this.anchor);
	  },
	  remove: function remove() {
	    if (this.frag) {
	      this.frag.remove();
	      this.frag = null;
	    }
	    if (this.elseEl && !this.elseFrag) {
	      if (!this.elseFactory) {
	        this.elseFactory = new _factory2['default'](this.elseEl._context || this.vm, this.elseEl);
	      }
	      this.elseFrag = this.elseFactory.create(this._scope, this._frag);
	      this.elseFrag.before(this.anchor);
	    }
	  },
	  unbind: function unbind() {
	    if (this.frag) {
	      this.frag.destroy();
	    }
	    if (this.elseFrag) {
	      this.elseFrag.destroy();
	    }
	  }
	};
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _index = __webpack_require__(3);

	exports['default'] = {
	  bind: function bind() {
	    var next = (0, _index.nextElementSibling)(this.el);
	    if (next && (0, _index.getAttr)(next, 'v-else') !== null) {
	      this.elseEl = next;
	    }
	  },
	  update: function update(value) {
	    this.apply(this.el, value);
	    if (this.elseEl) {
	      this.apply(this.elseEl, !value);
	    }
	  },
	  apply: function apply(el, value) {
	    toggle();
	    function toggle() {
	      el.style.display = value ? '' : 'none';
	    }
	  }
	};
	module.exports = exports['default'];

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _index = __webpack_require__(3);

	var _priorities = __webpack_require__(25);

	var keyCodes = {
	  esc: 27,
	  tab: 9,
	  enter: 13,
	  space: 32,
	  'delete': [8, 46],
	  up: 38,
	  left: 37,
	  right: 39,
	  down: 40
	};

	function keyFilter(handler, keys) {
	  var codes = keys.map(function (key) {
	    var charCode = key.charCodeAt(0);
	    if (charCode > 47 && charCode < 58) {
	      return parseInt(key, 10);
	    }
	    if (key.length === 1) {
	      charCode = key.toUpperCase().charCodeAt(0);
	      if (charCode > 64 && charCode < 91) {
	        return charCode;
	      }
	    }
	    return keyCodes[key];
	  });
	  codes = [].concat.apply([], codes);
	  return function keyHandler(e) {
	    if (codes.indexOf(e.keyCode) > -1) {
	      return handler.call(this, e);
	    }
	  };
	}

	function stopFilter(handler) {
	  return function stopHandler(e) {
	    if (e.stopPropagation) {
	      e.stopPropagation();
	    } else {
	      e.cancelBubble = true;
	    }
	    return handler.call(this, e);
	  };
	}

	function preventFilter(handler) {
	  return function preventHandler(e) {
	    if (e.preventDefault) {
	      e.preventDefault();
	    } else {
	      e.returnValue = false;
	    }
	    return handler.call(this, e);
	  };
	}

	function selfFilter(handler, el) {
	  return function selfHandler(e) {
	    var target = e.target || e.srcElement;
	    var currentTarget = e.currentTarget || el;
	    if (target === currentTarget) {
	      return handler.call(this, e);
	    }
	  };
	}

	exports['default'] = {

	  priority: _priorities.ON,
	  acceptStatement: true,
	  keyCodes: keyCodes,

	  bind: function bind() {
	    if (this.el.tagName === 'IFRAME' && this.arg !== 'load') {
	      var self = this;
	      var oldHandler = this.handler;
	      this.handler = function (e) {
	        oldHandler.call(self, e);
	      };
	      this.iframeBind = function () {
	        if (_index.isIE8) {
	          process.env.NODE_ENV !== 'production' && (0, _index.warn)('v-on:' + this.arg + '="' + this.expression + '" no support iframe bind in ie8 ', this.vm);
	          return;
	        }
	        (0, _index.on)(self.el.contentWindow, self.arg, self.handler, self.modifiers.capture);
	      };
	      this.on('load', this.iframeBind);
	    }
	  },
	  update: function update(handler) {
	    if (!this.descriptor.raw) {
	      handler = function _handler() {};
	    }

	    if (typeof handler !== 'function') {
	      process.env.NODE_ENV !== 'production' && (0, _index.warn)('v-on:' + this.arg + '="' + this.expression + '" expects a function value, ' + 'got ' + handler, this.vm);
	      return;
	    }

	    if (this.modifiers.stop) {
	      handler = stopFilter(handler);
	    }
	    if (this.modifiers.prevent) {
	      handler = preventFilter(handler);
	    }
	    if (this.modifiers.self) {
	      handler = selfFilter(handler, this.el);
	    }

	    var keys = Object.keys(this.modifiers).filter(function (key) {
	      return key !== 'stop' && key !== 'prevent' && key !== 'self' && key !== 'capture';
	    });
	    if (keys.length) {
	      handler = keyFilter(handler, keys);
	    }

	    this.reset();
	    this.handler = handler;

	    if (this.iframeBind) {
	      this.iframeBind();
	    } else {
	      if (_index.isIE8 && this.modifiers.capture) {
	        process.env.NODE_ENV !== 'production' && (0, _index.warn)('v-on:' + this.arg + '="' + this.expression + '" no support capture mode in ie8 ', this.vm);
	      }
	      (0, _index.on)(this.el, this.arg, this.handler, this.modifiers.capture);
	    }
	  },
	  reset: function reset() {
	    var el = this.iframeBind ? this.el.contentWindow : this.el;
	    if (this.handler) {
	      (0, _index.off)(el, this.arg, this.handler);
	    }
	  },
	  unbind: function unbind() {
	    this.reset();
	  }
	};
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _index = __webpack_require__(3);

	var _priorities = __webpack_require__(25);

	var xlinkNS = 'http://www.w3.org/1999/xlink';
	var xlinkRE = /^xlink:/;

	var disallowedInterpAttrRE = /^v-|^:|^@|^(?:is|transition|transition-mode|debounce|track-by|stagger|enter-stagger|leave-stagger)$/;

	var attrWithPropsRE = /^(?:value|checked|selected|muted)$/;

	var enumeratedAttrRE = /^(?:draggable|contenteditable|spellcheck)$/;

	exports['default'] = {

	  priority: _priorities.BIND,

	  bind: function bind() {
	    var attr = this.arg;
	    var tag = this.el.tagName;

	    var descriptor = this.descriptor;
	    var tokens = descriptor.interp;
	    if (tokens) {
	      if (disallowedInterpAttrRE.test(attr) || attr === 'name' && (tag === 'PARTIAL' || tag === 'SLOT')) {
	        process.env.NODE_ENV !== 'production' && (0, _index.warn)(attr + '="' + descriptor.raw + '": ' + 'attribute interpolation is not allowed in Braces.js ' + 'directives and special attributes.', this.vm);
	        this.el.removeAttribute(attr);
	        this.invalid = true;
	      }

	      if (process.env.NODE_ENV !== 'production') {
	        var raw = attr + '="' + descriptor.raw + '": ';

	        if (attr === 'src') {
	          (0, _index.warn)(raw + 'interpolation in "src" attribute will cause ' + 'a 404 request. Use v-bind:src instead.', this.vm);
	        }

	        if (attr === 'style') {
	          (0, _index.warn)(raw + 'interpolation in "style" attribute will cause ' + 'the attribute to be discarded in Internet Explorer. ' + 'Use v-bind:style instead.', this.vm);
	        }
	      }
	    }
	  },
	  update: function update(value) {
	    if (this.invalid) {
	      return;
	    }
	    var attr = this.arg;
	    this.handleSingle(attr, value);
	  },
	  handleSingle: function handleSingle(attr, value) {
	    var el = this.el;
	    var interp = this.descriptor.interp;
	    if (this.modifiers.camel) {
	      attr = (0, _index.camelize)(attr);
	    }
	    if (!interp && attrWithPropsRE.test(attr) && attr in el) {
	      var attrValue = attr === 'value' ? value == null ? '' : value : value;

	      if (el[attr] !== attrValue) {
	        el[attr] = attrValue;
	      }
	    }

	    if (attr === 'value' && el.tagName === 'TEXTAREA') {
	      el.removeAttribute(attr);
	      return;
	    }

	    if (enumeratedAttrRE.test(attr)) {
	      el.setAttribute(attr, value ? 'true' : 'false');
	    } else if (value != null && value !== false) {
	      if (attr === 'class') {
	        (0, _index.setClass)(el, value);
	      }if (xlinkRE.test(attr)) {
	        if (process.env.NODE_ENV !== 'production') {
	          if (_index.isIE8) {
	            var raw = attr + '="' + this.descriptor.raw + '": ';
	            (0, _index.warn)(raw + ' no support xlink bind in ie8.', this.vm);
	          }
	        }
	        el.setAttributeNS(xlinkNS, attr, value === true ? '' : value);
	      } else {
	        el.setAttribute(attr, value === true ? '' : value);
	      }
	    } else {
	      el.removeAttribute(attr);
	    }
	  }
	};
	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _index = __webpack_require__(3);

	var _priorities = __webpack_require__(25);

	exports['default'] = {

	  priority: _priorities.EL,

	  bind: function bind() {
	    if (!this.arg) {
	      return;
	    }
	    var id = this.id = (0, _index.camelize)(this.arg);
	    var refs = (this._scope || this.vm).$els;
	    refs[id] = this.el;
	  },
	  unbind: function unbind() {
	    var refs = (this._scope || this.vm).$els;
	    if (refs[this.id] === this.el) {
	      refs[this.id] = null;
	    }
	  }
	};
	module.exports = exports['default'];

/***/ }),
/* 31 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports['default'] = {
	  bind: function bind() {
	    var el = this.el;
	    this.vm.$once('pre-hook:compiled', function () {
	      el.removeAttribute('v-cloak');
	    });
	  }
	};
	module.exports = exports['default'];

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.compileRegex = compileRegex;
	exports.parseText = parseText;
	exports.tokensToExp = tokensToExp;

	var _cache = __webpack_require__(16);

	var _cache2 = _interopRequireDefault(_cache);

	var _config = __webpack_require__(8);

	var _config2 = _interopRequireDefault(_config);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var regexEscapeRE = /[-.*+?^${}()|[\]/\\]/g;
	var cache = void 0,
	    tagRE = void 0,
	    htmlRE = void 0;

	function escapeRegex(str) {
	  return str.replace(regexEscapeRE, '\\$&');
	}

	function compileRegex() {
	  var open = escapeRegex(_config2['default'].delimiters[0]);
	  var close = escapeRegex(_config2['default'].delimiters[1]);
	  var unsafeOpen = escapeRegex(_config2['default'].unsafeDelimiters[0]);
	  var unsafeClose = escapeRegex(_config2['default'].unsafeDelimiters[1]);
	  tagRE = new RegExp(unsafeOpen + '((?:.|\\n)+?)' + unsafeClose + '|' + open + '((?:.|\\n)+?)' + close, 'g');
	  htmlRE = new RegExp('^' + unsafeOpen + '((?:.|\\n)+?)' + unsafeClose + '$');

	  cache = new _cache2['default'](1000);
	}

	function parseText(text) {
	  if (!cache) {
	    compileRegex();
	  }
	  var hit = cache.get(text);
	  if (hit) {
	    return hit;
	  }
	  if (!tagRE.test(text)) {
	    return null;
	  }
	  var tokens = [];
	  var lastIndex = tagRE.lastIndex = 0;
	  var match, index, html, value;

	  while (match = tagRE.exec(text)) {
	    index = match.index;

	    if (index > lastIndex) {
	      tokens.push({
	        value: text.slice(lastIndex, index)
	      });
	    }

	    html = htmlRE.test(match[0]);
	    value = html ? match[1] : match[2];
	    tokens.push({
	      tag: true,
	      value: value.trim(),
	      html: html
	    });
	    lastIndex = index + match[0].length;
	  }
	  if (lastIndex < text.length) {
	    tokens.push({
	      value: text.slice(lastIndex)
	    });
	  }
	  cache.put(text, tokens);
	  return tokens;
	}

	function tokensToExp(tokens, vm) {
	  if (tokens.length > 1) {
	    return tokens.map(function (token) {
	      return formatToken(token, vm);
	    }).join('+');
	  } else {
	    return formatToken(tokens[0], vm, true);
	  }
	}

	function formatToken(token, vm, single) {
	  return token.tag ? inlineFilters(token.value, single) : '"' + token.value + '"';
	}

	function inlineFilters(exp, single) {
	  return single ? exp : '(' + exp + ')';
	}

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.parseDirective = parseDirective;

	var _cache = __webpack_require__(16);

	var _cache2 = _interopRequireDefault(_cache);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var cache = new _cache2['default'](1000);

	function parseDirective(s) {
	  var hit = cache.get(s);
	  if (hit) {
	    return hit;
	  }

	  var dir = {};
	  dir.expression = s.trim();

	  cache.put(s, dir);
	  return dir;
	}

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports['default'] = function (Braces) {

	  Braces.prototype.$get = function (exp, asStatement) {
	    var res = (0, _expression.parseExpression)(exp);
	    if (res) {
	      if (asStatement) {
	        var self = this;
	        return function statementHandler() {
	          self.$arguments = (0, _index.toArray)(arguments);
	          var result = res.get.call(self, self);
	          self.$arguments = null;
	          return result;
	        };
	      } else {
	        try {
	          return res.get.call(this, this);
	        } catch (e) {}
	      }
	    }
	  };
	};

	var _index = __webpack_require__(3);

	var _expression = __webpack_require__(15);

	module.exports = exports['default'];

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports['default'] = function (Braces) {

	  Braces.prototype.$nextTick = function (fn) {
	    (0, _index.nextTick)(fn, this);
	  };

	  Braces.prototype.$appendTo = function (target, cb) {
	    return insert(this, target, cb, append);
	  };

	  Braces.prototype.$prependTo = function (target, cb) {
	    target = query(target);
	    if (target.hasChildNodes()) {
	      this.$before(target.firstChild, cb);
	    } else {
	      this.$appendTo(target, cb);
	    }
	    return this;
	  };

	  Braces.prototype.$before = function (target, cb) {
	    return insert(this, target, cb, beforeWithCb);
	  };

	  Braces.prototype.$after = function (target, cb) {
	    target = query(target);
	    if (target.nextSibling) {
	      this.$before(target.nextSibling, cb);
	    } else {
	      this.$appendTo(target.parentNode, cb);
	    }
	    return this;
	  };

	  Braces.prototype.$remove = function (cb) {
	    if (!this.$el.parentNode) {
	      return cb && cb();
	    }
	    var inDocument = this._isAttached && (0, _index.inDoc)(this.$el);

	    var self = this;
	    var realCb = function realCb() {
	      if (inDocument) self._callHook('detached');
	      if (cb) cb();
	    };
	    if (this._isFragment) {
	      (0, _index.removeNodeRange)(this._fragmentStart, this._fragmentEnd, this, this._fragment, realCb);
	    } else {
	      var op = removeWithCb;
	      op(this.$el, this, realCb);
	    }
	    return this;
	  };

	  function insert(vm, target, cb, op) {
	    target = query(target);
	    var targetIsDetached = !(0, _index.inDoc)(target);
	    var shouldCallHook = !targetIsDetached && !vm._isAttached && !(0, _index.inDoc)(vm.$el);
	    if (vm._isFragment) {
	      (0, _index.mapNodeRange)(vm._fragmentStart, vm._fragmentEnd, function (node) {
	        op(node, target, vm);
	      });
	      cb && cb();
	    } else {
	      op(vm.$el, target, vm, cb);
	    }
	    if (shouldCallHook) {
	      vm._callHook('attached');
	    }
	    return vm;
	  }

	  function query(el) {
	    return typeof el === 'string' ? document.querySelector(el) : el;
	  }

	  function append(el, target, vm, cb) {
	    target.appendChild(el);
	    if (cb) cb();
	  }

	  function beforeWithCb(el, target, vm, cb) {
	    (0, _index.before)(el, target);
	    if (cb) cb();
	  }

	  function removeWithCb(el, vm, cb) {
	    (0, _index.remove)(el);
	    if (cb) cb();
	  }
	};

	var _index = __webpack_require__(3);

	module.exports = exports['default'];

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports['default'] = function (Braces) {

	  Braces.prototype.$on = function (event, fn) {
	    (this._events[event] || (this._events[event] = [])).push(fn);
	    return this;
	  };

	  Braces.prototype.$once = function (event, fn) {
	    var self = this;
	    function on() {
	      self.$off(event, on);
	      fn.apply(this, arguments);
	    }
	    on.fn = fn;
	    this.$on(event, on);
	    return this;
	  };

	  Braces.prototype.$off = function (event, fn) {
	    var cbs;

	    if (!arguments.length) {
	      this._events = {};
	      return this;
	    }

	    cbs = this._events[event];
	    if (!cbs) {
	      return this;
	    }
	    if (arguments.length === 1) {
	      this._events[event] = null;
	      return this;
	    }

	    var cb;
	    var i = cbs.length;
	    while (i--) {
	      cb = cbs[i];
	      if (cb === fn || cb.fn === fn) {
	        cbs.splice(i, 1);
	        break;
	      }
	    }
	    return this;
	  };

	  Braces.prototype.$emit = function (event) {
	    var isSource = typeof event === 'string';
	    event = isSource ? event : event.name;
	    var cbs = this._events[event];
	    if (cbs) {
	      var args = (0, _index.toArray)(arguments, 1);
	      for (var i = 0, l = cbs.length; i < l; i++) {
	        var cb = cbs[i];
	        cb.apply(this, args);
	      }
	    }
	  };
	};

	var _index = __webpack_require__(3);

	module.exports = exports['default'];

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports['default'] = function (Braces) {

	  Braces.prototype.$mount = function (el) {
	    if (this._isCompiled) {
	      process.env.NODE_ENV !== 'production' && (0, _index.warn)('$mount() should be called only once.', this);
	      return;
	    }
	    el = (0, _index.query)(el);
	    if (!el) {
	      el = document.createElement('div');
	    }
	    this._compile(el);
	    this._initDOMHooks();
	    if ((0, _index.inDoc)(this.$el)) {
	      this._callHook('attached');
	      ready.call(this);
	    } else {
	      this.$once('hook:attached', ready);
	    }
	    return this;
	  };

	  function ready() {
	    this._isAttached = true;
	    this._isReady = true;
	    this._callHook('ready');
	  }

	  Braces.prototype.$destroy = function (remove, deferCleanup) {
	    this._destroy(remove, deferCleanup);
	  };

	  Braces.prototype.$compile = function (el, scope, frag) {
	    return (0, _index2.compile)(el, this.$options, true)(this, el, scope, frag);
	  };
	};

	var _index = __webpack_require__(3);

	var _index2 = __webpack_require__(18);

	module.exports = exports['default'];
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports['default'] = function (Braces) {

	  Braces.options = {
	    directives: _index2['default'],
	    replace: true
	  };

	  Braces.util = util;
	  Braces.config = _config2['default'];
	  Braces.nextTick = util.nextTick;

	  Braces.compiler = compiler;
	  Braces.FragmentFactory = _factory2['default'];
	  Braces.parsers = {
	    path: path,
	    text: text,
	    template: template,
	    directive: directive,
	    expression: expression
	  };

	  Braces.cid = 0;

	  _config2['default']._assetTypes.forEach(function (type) {
	    Braces[type] = function (id, definition) {
	      if (!definition) {
	        return this.options[type + 's'][id];
	      } else {
	        this.options[type + 's'][id] = definition;
	        return definition;
	      }
	    };
	  });
	};

	var _config = __webpack_require__(8);

	var _config2 = _interopRequireDefault(_config);

	var _index = __webpack_require__(19);

	var _index2 = _interopRequireDefault(_index);

	var _index3 = __webpack_require__(3);

	var util = _interopRequireWildcard(_index3);

	var _index4 = __webpack_require__(18);

	var compiler = _interopRequireWildcard(_index4);

	var _path = __webpack_require__(39);

	var path = _interopRequireWildcard(_path);

	var _text = __webpack_require__(32);

	var text = _interopRequireWildcard(_text);

	var _template = __webpack_require__(17);

	var template = _interopRequireWildcard(_template);

	var _directive = __webpack_require__(33);

	var directive = _interopRequireWildcard(_directive);

	var _expression = __webpack_require__(15);

	var expression = _interopRequireWildcard(_expression);

	var _factory = __webpack_require__(23);

	var _factory2 = _interopRequireDefault(_factory);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	module.exports = exports['default'];

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.parsePath = parsePath;
	exports.getPath = getPath;
	exports.setPath = setPath;

	var _expression = __webpack_require__(15);

	var _index = __webpack_require__(3);

	var _cache = __webpack_require__(16);

	var _cache2 = _interopRequireDefault(_cache);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var pathCache = new _cache2['default'](1000);

	var APPEND = 0;
	var PUSH = 1;
	var INC_SUB_PATH_DEPTH = 2;
	var PUSH_SUB_PATH = 3;

	var BEFORE_PATH = 0;
	var IN_PATH = 1;
	var BEFORE_IDENT = 2;
	var IN_IDENT = 3;
	var IN_SUB_PATH = 4;
	var IN_SINGLE_QUOTE = 5;
	var IN_DOUBLE_QUOTE = 6;
	var AFTER_PATH = 7;
	var ERROR = 8;

	var pathStateMachine = [];

	pathStateMachine[BEFORE_PATH] = {
	  'ws': [BEFORE_PATH],
	  'ident': [IN_IDENT, APPEND],
	  '[': [IN_SUB_PATH],
	  'eof': [AFTER_PATH]
	};

	pathStateMachine[IN_PATH] = {
	  'ws': [IN_PATH],
	  '.': [BEFORE_IDENT],
	  '[': [IN_SUB_PATH],
	  'eof': [AFTER_PATH]
	};

	pathStateMachine[BEFORE_IDENT] = {
	  'ws': [BEFORE_IDENT],
	  'ident': [IN_IDENT, APPEND]
	};

	pathStateMachine[IN_IDENT] = {
	  'ident': [IN_IDENT, APPEND],
	  '0': [IN_IDENT, APPEND],
	  'number': [IN_IDENT, APPEND],
	  'ws': [IN_PATH, PUSH],
	  '.': [BEFORE_IDENT, PUSH],
	  '[': [IN_SUB_PATH, PUSH],
	  'eof': [AFTER_PATH, PUSH]
	};

	pathStateMachine[IN_SUB_PATH] = {
	  "'": [IN_SINGLE_QUOTE, APPEND],
	  '"': [IN_DOUBLE_QUOTE, APPEND],
	  '[': [IN_SUB_PATH, INC_SUB_PATH_DEPTH],
	  ']': [IN_PATH, PUSH_SUB_PATH],
	  'eof': ERROR,
	  'else': [IN_SUB_PATH, APPEND]
	};

	pathStateMachine[IN_SINGLE_QUOTE] = {
	  "'": [IN_SUB_PATH, APPEND],
	  'eof': ERROR,
	  'else': [IN_SINGLE_QUOTE, APPEND]
	};

	pathStateMachine[IN_DOUBLE_QUOTE] = {
	  '"': [IN_SUB_PATH, APPEND],
	  'eof': ERROR,
	  'else': [IN_DOUBLE_QUOTE, APPEND]
	};

	function getPathCharType(ch) {
	  if (ch === undefined) {
	    return 'eof';
	  }

	  var code = ch.charCodeAt(0);

	  switch (code) {
	    case 0x5B:
	    case 0x5D:
	    case 0x2E:
	    case 0x22:
	    case 0x27:
	    case 0x30:
	      return ch;

	    case 0x5F:
	    case 0x24:
	      return 'ident';

	    case 0x20:
	    case 0x09:
	    case 0x0A:
	    case 0x0D:
	    case 0xA0:
	    case 0xFEFF:
	    case 0x2028:
	    case 0x2029:
	      return 'ws';
	  }

	  if (code >= 0x61 && code <= 0x7A || code >= 0x41 && code <= 0x5A) {
	    return 'ident';
	  }

	  if (code >= 0x31 && code <= 0x39) {
	    return 'number';
	  }

	  return 'else';
	}

	function formatSubPath(path) {
	  var trimmed = path.trim();

	  if (path.charAt(0) === '0' && isNaN(path)) {
	    return false;
	  }
	  return (0, _index.isLiteral)(trimmed) ? (0, _index.stripQuotes)(trimmed) : '*' + trimmed;
	}

	function parse(path) {
	  var keys = [];
	  var index = -1;
	  var mode = BEFORE_PATH;
	  var subPathDepth = 0;
	  var c, newChar, key, type, transition, action, typeMap;

	  var actions = [];

	  actions[PUSH] = function () {
	    if (key !== undefined) {
	      keys.push(key);
	      key = undefined;
	    }
	  };

	  actions[APPEND] = function () {
	    if (key === undefined) {
	      key = newChar;
	    } else {
	      key += newChar;
	    }
	  };

	  actions[INC_SUB_PATH_DEPTH] = function () {
	    actions[APPEND]();
	    subPathDepth++;
	  };

	  actions[PUSH_SUB_PATH] = function () {
	    if (subPathDepth > 0) {
	      subPathDepth--;
	      mode = IN_SUB_PATH;
	      actions[APPEND]();
	    } else {
	      subPathDepth = 0;
	      key = formatSubPath(key);
	      if (key === false) {
	        return false;
	      } else {
	        actions[PUSH]();
	      }
	    }
	  };

	  function maybeUnescapeQuote() {
	    var nextChar = path[index + 1];
	    if (mode === IN_SINGLE_QUOTE && nextChar === "'" || mode === IN_DOUBLE_QUOTE && nextChar === '"') {
	      index++;
	      newChar = '\\' + nextChar;
	      actions[APPEND]();
	      return true;
	    }
	  }

	  while (mode != null) {
	    index++;
	    c = path[index];

	    if (c === '\\' && maybeUnescapeQuote()) {
	      continue;
	    }

	    type = getPathCharType(c);
	    typeMap = pathStateMachine[mode];
	    transition = typeMap[type] || typeMap['else'] || ERROR;

	    if (transition === ERROR) {
	      return;
	    }

	    mode = transition[0];
	    action = actions[transition[1]];
	    if (action) {
	      newChar = transition[2];
	      newChar = newChar === undefined ? c : newChar;
	      if (action() === false) {
	        return;
	      }
	    }

	    if (mode === AFTER_PATH) {
	      keys.raw = path;
	      return keys;
	    }
	  }
	}

	function parsePath(path) {
	  var hit = pathCache.get(path);
	  if (!hit) {
	    hit = parse(path);
	    if (hit) {
	      pathCache.put(path, hit);
	    }
	  }
	  return hit;
	}

	function getPath(obj, path) {
	  return (0, _expression.parseExpression)(path).get(obj);
	}

	var warnNonExistent;
	if (process.env.NODE_ENV !== 'production') {
	  warnNonExistent = function warnNonExistent(path, vm) {
	    (0, _index.warn)('You are setting a non-existent path "' + path.raw + '" ' + 'on a vm instance. Consider pre-initializing the property ' + 'with the "data" option for more reliable reactivity ' + 'and better performance.', vm);
	  };
	}

	function setPath(obj, path, val) {
	  var original = obj;
	  if (typeof path === 'string') {
	    path = parse(path);
	  }
	  if (!path || !(0, _index.isObject)(obj)) {
	    return false;
	  }
	  var last, key;
	  for (var i = 0, l = path.length; i < l; i++) {
	    last = obj;
	    key = path[i];
	    if (key.charAt(0) === '*') {
	      key = (0, _expression.parseExpression)(key.slice(1)).get.call(original, original);
	    }
	    if (i < l - 1) {
	      obj = obj[key];
	      if (!(0, _index.isObject)(obj)) {
	        obj = {};
	        if (process.env.NODE_ENV !== 'production' && last._isBraces) {
	          warnNonExistent(path, last);
	        }
	        (0, _index.set)(last, key, obj);
	      }
	    } else {
	      if ((0, _index.isArray)(obj)) {
	        obj.$set(key, val);
	      } else if (key in obj) {
	        obj[key] = val;
	      } else {
	        if (process.env.NODE_ENV !== 'production' && obj._isBraces) {
	          warnNonExistent(path, obj);
	        }
	        (0, _index.set)(obj, key, val);
	      }
	    }
	  }
	  return true;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(7)))

/***/ })
/******/ ])
});
;