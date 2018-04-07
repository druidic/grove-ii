const Transform = require('./transform')

describe('Transform', function() {
  let t, spyCtx
  beforeEach(function() {
    spyCtx = jasmine.createSpyObj([
      'fillRect',
      'scale',
      'translate',
      'rotate',
      'save',
      'restore'
    ])
    t = Transform(spyCtx)
  })

  it('starts out with x = 0', function() {
    expect(t.x).toBe(0)
  })

  it('starts out with y = 0', function() {
    expect(t.y).toBe(0)
  })

  it('starts out with scaleX = 1', function() {
    expect(t.scaleX).toBe(1)
  })

  it('starts out with scaleY = 1', function() {
    expect(t.scaleX).toBe(1)
  })

  it('starts out with angle = 0', function() {
    expect(t.angle).toBe(0)
  })

  it('sets scale', function() {
    t.scale(3, 4)
    expect(t.scaleX).toBe(3)
    expect(t.scaleY).toBe(4)
    t.scale(5, 6)
    expect(t.scaleX).toBe(5)
    expect(t.scaleY).toBe(6)
  })

  it('saves and locks in the current transforms', function() {
    t.scale(2, 3)

    let called = false
    t.draw(() => {
      called = true
      expect(t.scaleX).toBe(4)
      expect(t.scaleY).toBe(5)
      t.scale(2, 3)
      expect(t.scaleX).toBe(8)
      expect(t.scaleY).toBe(15)
    }, 0, 0, 4, 5)

    expect(called).toBe(true)
    expect(t.scaleX).toBe(2)
    expect(t.scaleY).toBe(3)
  })

  it('restores saved transforms', function() {
    t.scale(2, 3)
    t.save()
    t.scale(4, 5)
    t.restore()
    expect(t.scaleX).toBe(2)
    expect(t.scaleY).toBe(3)
  })
})
