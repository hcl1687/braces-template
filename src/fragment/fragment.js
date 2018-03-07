import {
  createAnchor,
  before,
  prepend,
  inDoc,
  mapNodeRange,
  removeNodeRange,
  remove,
  arrRemove,
  isIE8
} from '../util/index'

/**
 * Abstraction for a partially-compiled fragment.
 * Can optionally compile content with a child scope.
 *
 * @param {Function} linker
 * @param {Braces} vm
 * @param {DocumentFragment} frag
 * @param {Object} [scope]
 * @param {Fragment} [parentFrag]
 */

export default function Fragment (linker, vm, frag, scope, parentFrag) {
  this.children = []
  this.childFrags = []
  this.vm = vm
  this.scope = scope
  this.inserted = false
  this.parentFrag = parentFrag
  if (parentFrag) {
    parentFrag.childFrags.push(this)
  }
  this.unlink = linker(vm, frag, scope, this)
  var single = this.single =
    frag.childNodes.length === 1 &&
    // do not go single mode if the only node is an anchor
    !(frag.childNodes[0].__v_anchor)
  if (single) {
    this.node = frag.childNodes[0]
    this.before = singleBefore
    this.remove = singleRemove
  } else {
    this.node = createAnchor('fragment-start')
    this.end = createAnchor('fragment-end')
    this.frag = frag
    prepend(this.node, frag)
    frag.appendChild(this.end)
    this.before = multiBefore
    this.remove = multiRemove
  }
  if (!isIE8) {
    this.node.__v_frag = this
  }
}

/**
 * Call attach/detach for all components contained within
 * this fragment. Also do so recursively for all child
 * fragments.
 *
 * @param {Function} hook
 */

Fragment.prototype.callHook = function (hook) {
  var i, l
  for (i = 0, l = this.childFrags.length; i < l; i++) {
    this.childFrags[i].callHook(hook)
  }
  for (i = 0, l = this.children.length; i < l; i++) {
    hook(this.children[i])
  }
}

/**
 * Insert fragment before target, single node version
 *
 * @param {Node} target
 * @param {Boolean} withTransition
 */

function singleBefore (target) {
  this.inserted = true
  var method = before
  method(this.node, target, this.vm)
  if (inDoc(this.node)) {
    this.callHook(attach)
  }
}

/**
 * Remove fragment, single node version
 */

function singleRemove () {
  this.inserted = false
  var shouldCallRemove = inDoc(this.node)
  this.beforeRemove()
  remove(this.node)
  if (shouldCallRemove) {
    this.callHook(detach)
  }
  this.destroy()
}

/**
 * Insert fragment before target, multi-nodes version
 *
 * @param {Node} target
 * @param {Boolean} withTransition
 */

function multiBefore (target) {
  this.inserted = true
  var vm = this.vm
  var method = before
  mapNodeRange(this.node, this.end, function (node) {
    method(node, target, vm)
  })
  if (inDoc(this.node)) {
    this.callHook(attach)
  }
}

/**
 * Remove fragment, multi-nodes version
 */

function multiRemove () {
  this.inserted = false
  var self = this
  var shouldCallRemove = inDoc(this.node)
  this.beforeRemove()
  removeNodeRange(this.node, this.end, this.vm, this.frag, function () {
    if (shouldCallRemove) {
      self.callHook(detach)
    }
    self.destroy()
  })
}

/**
 * Prepare the fragment for removal.
 */

Fragment.prototype.beforeRemove = function () {
  var i, l
  for (i = 0, l = this.childFrags.length; i < l; i++) {
    // call the same method recursively on child
    // fragments, depth-first
    this.childFrags[i].beforeRemove(false)
  }
  for (i = 0, l = this.children.length; i < l; i++) {
    // Call destroy for all contained instances,
    // with remove:false and defer:true.
    // Defer is necessary because we need to
    // keep the children to call detach hooks
    // on them.
    this.children[i].$destroy(false, true)
  }
}

/**
 * Destroy the fragment.
 */

Fragment.prototype.destroy = function () {
  if (this.parentFrag) {
    arrRemove(this.parentFrag.childFrags, this)
  }
  if (!isIE8) {
    this.node.__v_frag = null
  }
  this.unlink()
}

/**
 * Call attach hook for a Braces instance.
 *
 * @param {Braces} child
 */

function attach (child) {
  if (!child._isAttached && inDoc(child.$el)) {
    child._callHook('attached')
  }
}

/**
 * Call detach hook for a Braces instance.
 *
 * @param {Braces} child
 */

function detach (child) {
  if (child._isAttached && !inDoc(child.$el)) {
    child._callHook('detached')
  }
}
