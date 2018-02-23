var templateParser = require('src/parsers/template')
var parse = templateParser.parseTemplate
var testString = '<div>hello</div><p class="test">world</p>'

describe('Template Parser', function () {
  it('should return same if argument is already a fragment', function () {
    var frag = document.createDocumentFragment()
    var res = parse(frag)
    expect(res).to.equal(frag)
  })

  it('should parse if argument is a template string', function () {
    var res = parse(testString)
    expect(res.nodeType).to.equal(11)
    expect(res.childNodes.length).to.equal(2)
    expect(res.querySelector('.test').textContent).to.equal('world')
  })

  it('should work if the template string doesn\'t contain tags', function () {
    var res = parse('hello!')
    expect(res.nodeType).to.equal(11)
    expect(res.childNodes.length).to.equal(1)
    expect(res.firstChild.nodeType).to.equal(3) // Text node
  })

  it('should work if the template string doesn\'t contain tags but contains comments', function () {
    var res = parse('<!-- yo -->hello<!-- yo -->')
    expect(res.childNodes.length).to.equal(1)
    expect(res.firstChild.nodeType).to.equal(3) // text node
    expect(res.firstChild.nodeValue).to.equal('hello')
  })

  it('should handle string that contains html entities', function () {
    var res = parse('foo&lt;bar')
    expect(res.nodeType).to.equal(11)
    expect(res.childNodes.length).to.equal(1)
    expect(res.firstChild.nodeValue).to.equal('foo<bar')
    // #1330
    res = parse('hello &#x2F; hello')
    expect(res.nodeType).to.equal(11)
    expect(res.childNodes.length).to.equal(1)
    expect(res.firstChild.nodeValue).to.equal('hello / hello')
    // #2021
    res = parse('&#xe604;')
    expect(res.nodeType).to.equal(11)
    expect(res.childNodes.length).to.equal(1)
    expect(res.firstChild.nodeValue).to.equal('')
  })

  it('should parse innerHTML if argument is a template node', function () {
    var templateNode = document.createElement('template')
    templateNode.innerHTML = testString
    var res = parse(templateNode)
    expect(res.nodeType).to.equal(11)
    expect(res.childNodes.length).to.equal(2)
    expect(res.querySelector('.test').textContent).to.equal('world')
  })

  it('should parse textContent if argument is a script node', function () {
    var node = document.createElement('script')
    node.textContent = testString
    var res = parse(node)
    expect(res.nodeType).to.equal(11)
    expect(res.childNodes.length).to.equal(2)
    expect(res.querySelector('.test').textContent).to.equal('world')
  })

  it('should parse innerHTML if argument is a normal node', function () {
    var node = document.createElement('div')
    node.innerHTML = testString
    var res = parse(node)
    expect(res.nodeType).to.equal(11)
    expect(res.childNodes.length).to.equal(2)
    expect(res.querySelector('.test').textContent).to.equal('world')
  })

  it('should retrieve and parse if argument is an id selector', function () {
    var node = document.createElement('script')
    node.setAttribute('id', 'template-test')
    node.setAttribute('type', 'x/template')
    node.textContent = testString
    document.head.appendChild(node)
    var res = parse('#template-test')
    expect(res.nodeType).to.equal(11)
    expect(res.childNodes.length).to.equal(2)
    expect(res.querySelector('.test').textContent).to.equal('world')
    document.head.removeChild(node)
  })

  it('should work for table elements', function () {
    var res = parse('<td>hello</td>')
    expect(res.nodeType).to.equal(11)
    expect(res.childNodes.length).to.equal(1)
    expect(res.firstChild.tagName).to.equal('TD')
    expect(res.firstChild.textContent).to.equal('hello')
  })

  it('should work for option elements', function () {
    var res = parse('<option>hello</option>')
    expect(res.nodeType).to.equal(11)
    expect(res.childNodes.length).to.equal(1)
    expect(res.firstChild.tagName).to.equal('OPTION')
    expect(res.firstChild.textContent).to.equal('hello')
  })

  it('should work for svg elements', function () {
    var res = parse('<circle></circle>')
    expect(res.nodeType).to.equal(11)
    expect(res.childNodes.length).to.equal(1)
    // SVG tagNames should be lowercase because they are XML nodes not HTML
    expect(res.firstChild.tagName).to.equal('circle')
    expect(res.firstChild.namespaceURI).to.equal('http://www.w3.org/2000/svg')
  })

  it('should cache template strings', function () {
    var res1 = parse(testString)
    var res2 = parse(testString)
    expect(res1).to.equal(res2)
  })

  it('should clone', function () {
    var res1 = parse(testString, true)
    var res2 = parse(testString, true)
    expect(res1).not.to.equal(res2)
  })

  it('should cache id selectors', function () {
    var node = document.createElement('script')
    node.setAttribute('id', 'template-test')
    node.setAttribute('type', 'x/template')
    node.textContent = '<div>never seen before content</div>'
    document.head.appendChild(node)
    var res1 = parse('#template-test')
    var res2 = parse('#template-test')
    expect(res1).to.equal(res2)
    document.head.removeChild(node)
  })

  it('should be able to not use id selectors', function () {
    var res = parse('#hi', false, true)
    expect(res.nodeType).to.equal(11)
    expect(res.firstChild.nodeValue).to.equal('#hi')
  })

  it('should deal with Safari template clone bug', function () {
    var a = document.createElement('div')
    a.innerHTML = '<template>1</template>'
    var c = templateParser.cloneNode(a)
    expect(c.firstChild.innerHTML).to.equal('1')
  })

  it('should deal with Safari template clone bug even when nested', function () {
    var a = document.createElement('div')
    a.innerHTML = '<template><div>1</div><template>2</template></template>'
    var c = templateParser.cloneNode(a)
    expect(c.firstChild.innerHTML).to.equal('<div>1</div><template>2</template>')
  })

  it('should deal with IE textarea clone bug', function () {
    var t = document.createElement('textarea')
    t.placeholder = 't'
    var c = templateParser.cloneNode(t)
    expect(c.value).to.equal('')
  })

  it('should trim empty text nodes and comments', function () {
    // string
    var res = parse('    <p>test</p>    ')
    expect(res.childNodes.length).to.equal(1)
    expect(res.firstChild.tagName).to.equal('P')
    // nodes
    var el = document.createElement('div')
    el.innerHTML = '<template>    <p>test</p>    </template>'
    res = parse(el.children[0])
    expect(res.childNodes.length).to.equal(1)
    expect(res.firstChild.tagName).to.equal('P')
    // comments
    res = parse('  <!-- yo -->  <p>test</p>  <!-- yo -->  ')
    expect(res.childNodes.length).to.equal(1)
    expect(res.firstChild.tagName).to.equal('P')
  })

  it('should reuse fragment from cache for the same string template', function () {
    var stringTemplate = '    <p>test</p>    '
    // When parsing a template, adds the created fragment to a cache
    var res = parse(stringTemplate)

    var newRes = parse(stringTemplate)
    expect(newRes).to.equal(res)
  })
})
