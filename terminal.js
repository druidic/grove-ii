function Terminal(canvasId) {
  const canvas = document.getElementById(canvasId)
  const ctx = canvas.getContext('2d')
  ctx.font = '16pt monospace'
  const width = canvas.width
  const height = canvas.height

  ctx.save()

  return self = {
    clear, // erase everything and return the cursor color, position, etc. to their original state.
           // this puts the canvas back the way it was before anything was drawn.
    at, // move to coordinates. Scaled by the current scale()
    //move, // move the given distances in X, Y coordinates. Scaled by the current scale()
    scale, // multiply the current scale by the given factor. Future drawing and moving operations will
           // be scaled by this value.
    fill, // fill in a rectangle with the given (scaled) width and height.
    draw, // define a subdrawing, using the given position, scale, and rotation of the cursor to define the coordinate system.
    //color, // change the foreground color for subsequent drawing operations
    text, // draw text. The cursor position defines the baseline and top edge of the text.
          // the current scale is used as the font height.
    writeLine, // same as text, but moves the cursor to the bottom left of the text after drawing.
         // useful when writing many lines sequentially.
    tap, // pass the terminal instance to the given function.
    ctx,
  }

  function clear() {
    ctx.clearRect(0, 0, width, height)
    cursorX = cursorY = 0
    return self
  }

  function fill(width, height) {
    ctx.fillRect(cursorX * scaleX, cursorY * scaleY, width * scaleX, height * scaleY)
    return self
  }

  function draw(fn, ...transforms) {
    let x = 0
    let y = 0
    let scaleX = 1
    let scaleY = 1
    let angle = 0

    console.log(ctx)

    switch (transforms.length) {
      case 0:
        // no transformations
        break;
      case 2:
        [x, y] = transforms
        break;
      case 3:
        [x, y, scaleX] = transforms
        scaleY = scaleX
        break;
      case 4:
        [x, y, scaleX, scaleY] = transforms
        break;
      case 5:
        [x, y, scaleX, scaleY, angle] = transforms
        break;
      default:
        throw 'invalid transform arguments to Terminal.sub(): ' + transforms.join(', ')
    }

    console.log(ctx, ctx.save)
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(scaleX, scaleY)
    angle && ctx.rotate(angle)

    fn(self)

    ctx.restore()
    return self
  }

  function text(s) {
    writeLine(s)
    ctx.translate(0, -16)
    return self
  }

  function scale(x, y) {
    ctx.restore()
    ctx.save()
    ctx.scale(x, y)
    // scaleX = x
    // if (typeof y !== 'undefined') {
    //   scaleY = y
    // } else {
    //   scaleY = x
    // }
    return self
  }

  function at(x, y) {
    cursorX = x
    cursorY = y
    return self
  }

  function writeLine(s) {
    ctx.translate(0, 16)
    ctx.fillText(s)
    return self
  }

  function tap(fn) {
    fn(self)
    return self
  }
}
