const realWindow = window
const WindowRestorer = (function() {
  const originalWindowProperties = {}
  for (let prop in realWindow) {
    if (realWindow.hasOwnProperty(prop)) {
      originalWindowProperties[prop] = realWindow.prop
    }
  }

  return restore

  function restore() {
    for (let prop in realWindow) {
      if (Object.prototype.hasOwnProperty.call(realWindow, prop)) {
        if (!(prop in originalWindowProperties)) {
          delete realWindow[prop]
        }
      }
    }
  }
})();
