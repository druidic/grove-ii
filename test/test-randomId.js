describe('randomId', function() {
  it('always returns an 8-character string', function() {
    expect(randomId().length).toBe(8)
  })

  it('returns a different value every time', function() {
    expect(randomId()).not.toBe(randomId())
  })
})
