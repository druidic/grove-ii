const Files = {}
Files.memory = {}

;(function() {
  const fileBoundary = '\n--- {} - DO NOT EDIT THIS LINE ---\n'
  const LOCAL_STORAGE_KEY = 'files'

  //////////////////////////////////////////////////////////
  // public functions
  //////////////////////////////////////////////////////////

  Files.set = function(name, content) {
    if (!Files.memory[name]) {
      Files.memory[name] = {metadata: {filename: name}}
    }
    Files.memory[name].content = content
    writeToLocalStorage()
  }

  Files.get = function(name) {
    if (Files.memory[name]) {
      return Files.memory[name].content
    }
    return ''
  }

  Files.writeToDisk = function() {
    var blob = new Blob(
      [localStorage[LOCAL_STORAGE_KEY]],
      {type: "text/plain;charset=utf-8"});

    saveAs(blob, 'save.txt')
  }

  Files.loadFromString = function(s) {
    Files.memory = parseFiles(s)
    writeToLocalStorage()
  }

  Files[Symbol.iterator] = function *() {
    for (let name in Files.memory) {
      yield name
    }
  }

  //////////////////////////////////////////////////////////
  // private functions
  //////////////////////////////////////////////////////////

  function writeToLocalStorage() {
    localStorage[LOCAL_STORAGE_KEY] = serializeFiles(Files.memory)
  }

  function parseFiles(raw) {
    if (!raw) return {}

    let unique = raw.slice(0, 8)
    let delimeter = fileBoundary.replace('{}', unique)
    let parts = raw.slice(9).split(delimeter)
    // each file has a pair of parts; a metadata section
    // and the actual file content.
    let files = {}
    if (parts.length % 2 !== 0) {
      console.error('Corrupt file.')
      return {}
    }
    for (let i = 0; parts[i]; i += 2) {
      let metadata = JSON.parse(parts[i])
      let content = parts[i + 1]
      files[metadata.filename] = {
        metadata,
        content
      }
    }
    return files
  }

  function serializeFiles(files) {
    let parts = []
    for (let filename in files) {
      let file = files[filename]
      parts.push(JSON.stringify(file.metadata))
      parts.push(file.content)
    }

    retry: for (;;) {

    let unique = generateUniqueString()

    if (parts.some(p => p.includes(unique))) {
      continue retry;
    }

    let delimiter = fileBoundary.replace('{}', unique)
    return unique + '\n' + parts.join(delimiter)
  }}

  function readFilesFromDisk(fileHandle) {
    let reader = new FileReader()
    reader.addEventListener('load', handleFileContents)
    reader.readAsText(fileHandle)

    function handleFileContents() {
      let text = reader.result
      localStorage['files'] = text
      loadInMemoryFilesFromLocalStorage()
    }
  }

  function loadInMemoryFilesFromLocalStorage() {
    Files.loadFromString(localStorage['files'])
  }

  function generateUniqueString() {
    let chars = '1234567890'
      + 'abcdefghijklmnopqrstuvwxyz'
      + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      + '_-'

    let unique = ''
    for (let i = 0; i < 8; i++) {
      unique += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return unique
  }

  //////////////////////////////////////////////////////////
  // initialization
  //////////////////////////////////////////////////////////

  loadInMemoryFilesFromLocalStorage()
})();
