const logItemsElement = document.getElementById('log-items')

let pageStack = []

function interstitialLog(text, color) {
  cutLog()
  log(text, color, 'transparent')
  cutLog()
}

function log(text, color='black') {
  if (!pageStack.length) return

  let currentPage = pageStack[pageStack.length - 1]

  let span = document.createElement('span')
  span.style.color = color
  span.innerText = text + '\n'
  currentPage.appendChild(span)
  logItemsElement.scrollTop = 2147483647
}

function ask(text) {
  log(text, '#a40')
}

function inform(text) {
  log(text, '#00c')
}

function echo(text) {
  log(text, '#d70')
}

function alert(text) {
  log(text, '#f40')
}

function cutLog() {
  // deprecated
}

function logPushPage() {
  let page = document.createElement('div')
  page.classList.add('page')
  logItemsElement.appendChild(page)
  pageStack.push(page)
}

function logPopPage() {
  let page = pageStack.pop()
  let currentHeight = page.offsetHeight

  let interval = setInterval(function() {
    currentHeight *= 0.7
    currentHeight -= 5
    page.style.height = '' + currentHeight + 'px'

    if (currentHeight <= 0) {
      page.remove()
      clearInterval(interval)
    }
  }, 25)
}
