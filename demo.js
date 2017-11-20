/**
 * Create a "Matrix" falling-text effect. The built-in
 * persistence of the simulated CRT display is used to make
 * the letters gradually fade away.
 */

const streams = []
/* stores the coordinates of the falling letter at the
 * head of each stream of characters.
 */

self.postMessage({
  action: 'setPersistence',
  value: 0.99
})
/* Make bright pixels persist for longer than normal after
 * they're overdrawn with dark. */

setInterval(function() {
  let commands = []

  /* Spawn a new stream with 50% probability each frame */
  if (Math.random() < 0.5) {
    streams.push({
      x: randomInt(40),
      y: randomInt(10)
    })

    /* Delete old streams to prevent the list from growing
     * without bound. */
    if (streams.length > 20) {
      var oldStream = streams.shift()
      /* Blank out the most recently drawn character */
      commands.push({
        action: 'blt',
        top: oldStream.y,
        left: oldStream.x,
        text: [' ']
      })
    }
  }

  /* Update and draw each stream */
  for (let i = 0; i < streams.length; i++) {
    let stream = streams[i]


    if (Math.random() < 0.01) {
      /* Add a small chance that streams will stop before
       * the bottom of the screen. Rather than delete the
       * stream we just push it down so it's no longer
       * visible. */

      /* Blank out the most recently drawn character */
      commands.push({
        action: 'blt',
        top: stream.y,
        left: stream.x,
        text: [' ']
      })

      stream.y = 9999
    } else {
      /* Draw a random letter on the screen at the current
       * position */
      commands.push({
        action: 'blt',
        top: stream.y,
        left: stream.x,
        text: [' ', randomChar()]
      })
    }

    stream.y++
    /* Make the stream fall */
  }

  self.postMessage({many: commands})
}, 80)

/**
 * Generate a random number in the range [0, n)
 */
function randomInt(n) {
  return Math.floor(Math.random() * n)
}

const chars = '1234567890AjkYvzXMuL'.split('')
function randomChar() {
  return chars[randomInt(chars.length)]
}
