const logItemsElement = document.getElementById('log-items')
const unflushedLogs = []
const newMessagesDivider = document.createElement('div')
newMessagesDivider.classList.add('new-messages')

let pageStack = []

function flushLog(toElement) {
  if (!toElement) {
    toElement = currentLogPage()
    if (!toElement) return
  }

  unflushedLogs.forEach(log => {
    let span = document.createElement('span')
    span.style.color = log.color
    span.innerText = log.text + '\n'
    toElement.appendChild(span)
  })

  logItemsElement.scrollTop = 2147483647
  unflushedLogs.length = 0
}

function flushLogInBlockquote(author) {
  if (!unflushedLogs.length) return
  let quote = createQuoteElement(author)
  appendElementToLogPage(quote)
  flushLog(quote)
}

function createQuoteElement(author) {
  let quote = document.createElement('blockquote')
  let attribution = document.createElement('div')
  attribution.classList.add('attribution')
  attribution.innerText = author + ' says:'
  quote.appendChild(attribution)
  return quote
}

function appendElementToLogPage(element) {
  let page = currentLogPage()
  if (!page) return
  page.appendChild(element)
}

function log(text, color='black') {
  unflushedLogs.push({text, color})
}

function ask(text) {
  log(text, '#a40')
}

function inform(text) {
  log(text, '#00c')
}

function echo(text) {
  log('$ ' + text, '#d70')
  return text
}

function alert(text) {
  log(text, '#f40')
}

function cutLog() {
  // deprecated
}

function logPushPage(title) {
  let page = document.createElement('div')
  page.classList.add('page')
  if (title) {
    let titleEl = document.createElement('div')
    titleEl.classList.add('title')
    titleEl.innerText = title
    page.appendChild(titleEl)
  }
  logItemsElement.appendChild(page)
  pageStack.push(page)
}

function logPopPage() {
  let page = pageStack.pop()

  let prevPage = pageStack[pageStack.length - 1]
  if (prevPage) {
    for (let child of prevPage.children) {
      if (!child.classList.contains('title')) {
        // fade out old logs so new information is more
        // prominent
        child.style.opacity = 0.5
      }
    }
    prevPage.appendChild(newMessagesDivider)
  }

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

function currentLogPage() {
  return pageStack[pageStack.length - 1]
}
