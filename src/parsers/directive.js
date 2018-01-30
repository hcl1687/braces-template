import Cache from '../cache'

const cache = new Cache(1000)

/**
 * Parse a directive value and extract the expression
 * and its filters into a descriptor.
 *
 * @param {String} s
 * @return {Object}
 */

export function parseDirective (s) {
  var hit = cache.get(s)
  if (hit) {
    return hit
  }

  var dir = {}
  dir.expression = s.trim()

  cache.put(s, dir)
  return dir
}
