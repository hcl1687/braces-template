import Cache from 'src/cache'

/**
 * Debug function to assert cache state
 *
 * @param {Cache} cache
 */

function toString (cache) {
  var s = ''
  var entry = cache.head
  while (entry) {
    s += String(entry.key) + ':' + entry.value
    entry = entry.newer
    if (entry) {
      s += ' < '
    }
  }
  return s
}

describe('Cache', () => {
  const c = new Cache(4)

  it('put', () => {
    c.put('adam', 29)
    c.put('john', 26)
    c.put('angela', 24)
    c.put('bob', 48)
    expect(toString(c)).to.equal('adam:29 < john:26 < angela:24 < bob:48')
  })

  it('put with same key', () => {
    const same = new Cache(4)
    same.put('john', 29)
    same.put('john', 26)
    same.put('john', 24)
    same.put('john', 48)
    expect(same.size).to.equal(1)
    expect(toString(same)).to.equal('john:48')
  })

  it('get', () => {
    expect(c.get('adam')).to.equal(29)
    expect(c.get('john')).to.equal(26)
    expect(c.get('angela')).to.equal(24)
    expect(c.get('bob')).to.equal(48)
    expect(toString(c)).to.equal('adam:29 < john:26 < angela:24 < bob:48')

    expect(c.get('angela')).to.equal(24)
    // angela should now be the tail
    expect(toString(c)).to.equal('adam:29 < john:26 < bob:48 < angela:24')
  })

  it('expire', () => {
    c.put('ygwie', 81)
    expect(c.size).to.equal(4)
    expect(toString(c)).to.equal('john:26 < bob:48 < angela:24 < ygwie:81')
    expect(c.get('adam')).to.be.an('undefined')
  })

  it('shift', () => {
    var shift = new Cache(4)
    shift.put('adam', 29)
    shift.put('john', 26)
    shift.put('angela', 24)
    shift.put('bob', 48)

    shift.shift()
    shift.shift()
    shift.shift()
    expect(shift.size).to.equal(1)
    expect(toString(shift)).to.equal('bob:48')
  })
})
