inject('randomId', () => {
  const chars
    = 'abcdefghijklmnopqrstuvwxyz'
    + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    + '1234567890'
    + '_-'

  return randomId

  function randomId() {
    let unique = ''
    for (let i = 0; i < 8; i++) {
      unique += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return unique
  }
})

inject('Files', ({localStorage, randomId}) => {
  return {
    get,
    set,
    destroy,
    clear,
    names,
    diskImage,
    load,
    any,
  }

  function get(name) {
    return localStorage['file:' + name] || ''
  }

  function set(name, content) {
    localStorage['file:' + name] = content
  }

  function destroy(name) {
    delete localStorage['file:' + name]
  }

  function clear() {
    names().forEach(destroy)
  }

  function names() {
    return Object.keys(localStorage)
      .filter(key => key.indexOf('file:') === 0)
      .map(key => key.slice('file:'.length))
  }

  function diskImage() {
    let divider = randomDivider()
    return divider
      + names()
        .map(name => name + divider + get(name))
        .join(divider)
  }

  function load(diskImage) {
    divider = diskImage.slice(0, randomDivider().length)

    pipe(diskImage.split(divider),
      drop(1),
      pairs)
      .forEach(pair => set(pair[0], pair[1]))
  }

  function any() {
    return !!names().length
  }

  /* PRIVATE FUNCTIONS */

  function randomDivider() {
    return '\n' + randomId() + ' --- DO NOT EDIT THIS LINE\n'
  }

  function pipe(obj, ...fns) {
    let val = obj
    fns.forEach(fn => val = fn(val))
    return val
  }

  function drop(n) {
    return array => array.slice(n)
  }

  function pairs(array) {
    let result = []
    for (let i = 0; i < array.length; i += 2) {
      result.push([array[i], array[i + 1]])
    }
    return result
  }
})
