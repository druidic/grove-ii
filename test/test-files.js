describe('Files', () => {
  let localStorage
  let Files
  beforeEach(() => {
    localStorage = {}
    function randomId() { return '12345678' }

    Files = inject({localStorage, randomId}).Files
  })

  it('reads files from localStorage', function() {
    localStorage['file:foo'] = 'this is foo'
    expect(Files.get('foo')).toBe('this is foo')
  })

  it('returns empty string for a missing file', function() {
    expect(Files.get('i do not exist')).toBe('')
  })

  it('writes files to localStorage', function() {
    Files.set('bar', 'yoink')
    expect(localStorage['file:bar']).toBe('yoink')
  })

  it('lists the names of the files that exist', function() {
    localStorage['file:foo'] = '1'
    localStorage['file:bar'] = '1'
    localStorage['file:baz'] = '1'

    expect(Files.names()).toEqual(['foo', 'bar', 'baz'])
  })

  it('deletes a file', function() {
    localStorage['file:foo'] = '1'
    localStorage['file:bar'] = '1'

    expect(Files.names()).toEqual(['foo', 'bar'])
    Files.destroy('foo')
    expect(Files.names()).toEqual(['bar'])
  })

  it('deletes all files', function() {
    localStorage['file:foo'] = '1'
    localStorage['file:bar'] = '1'

    expect(Files.names()).toEqual(['foo', 'bar'])
    expect(Files.any()).toBe(true)
    Files.clear()
    expect(Files.names()).toEqual([])
    expect(Files.any()).toBe(false)
  })

  let diskImage = `
12345678 --- DO NOT EDIT THIS LINE
foo
12345678 --- DO NOT EDIT THIS LINE
this is foo
12345678 --- DO NOT EDIT THIS LINE
bar
12345678 --- DO NOT EDIT THIS LINE
this is bar`

  it('creates a disk image', function() {
    Files.set('foo', 'this is foo')
    Files.set('bar', 'this is bar')

    expect(Files.diskImage()).toBe(diskImage)
  })

  it('loads a disk image', function() {
    Files.load(diskImage)

    expect(Files.get('foo')).toBe('this is foo')
    expect(Files.get('bar')).toBe('this is bar')
    expect(Files.get('i do not exist')).toBe('')
  })
})
