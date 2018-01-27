const Editor = {}
window.Files = inject().Files

Editor.fileSelector = document.getElementById('file-selector')
Editor.newFileButton = document.getElementById('new-file')
Editor.editor = ace.edit('editor')

Editor.currentlyEditingFile = 'main.js'

Editor.editor.setTheme("ace/theme/xcode");
Editor.editor.getSession().setMode("ace/mode/javascript");
Editor.editor.getSession().setUseSoftTabs(false)
Editor.editor.setValue(Files.get(Editor.currentlyEditingFile))
Editor.editor.clearSelection()

Editor.editor.addEventListener('blur', function() {
  Files.set(Editor.currentlyEditingFile, Editor.editor.getValue())
  if (Editor.currentlyEditingFile === 'ProgramVariables') {
    try {
      let vars = JSON.parse(Files.get('ProgramVariables'))
      for (let key in vars) {
        window[key] = vars[key]
      }
    } catch(e) {}
  }
  initUserProgram()
})

Editor.fileSelector.addEventListener('change', function() {
  Editor.switchToFile(Editor.fileSelector.value)
})

Editor.editor.getSession().on('changeMode', updateLinterOptions)

Editor.switchToFile = function(filename) {
  Editor.currentlyEditingFile = filename
  Editor.editor.setValue(Files.get(filename))
  Editor.editor.clearSelection()
  syncSelectOptions(Files.names(), filename, Editor.fileSelector)
  Editor.editor.getSession().setMode(filename.match(/\.js$/) ? 'ace/mode/javascript' : 'ace/mode/text');
}

Editor.newFileButton.addEventListener('click', function() {
  let name = prompt('Enter a name for the new file.')
  if (name) {
    Files.set(name, '')
    Editor.currentlyEditingFile = name
    Editor.editor.setValue('')
    syncSelectOptions(Files.names(), name, Editor.fileSelector)
    Editor.editor.getSession().setMode(name.match(/\.js$/) ? 'ace/mode/javascript' : 'ace/mode/text');
  }
})

Editor.switchToFile('main.js')

Editor.refresh = function() {
  let selection = Editor.editor.getSelectionRange()
  Editor.switchToFile(Editor.currentlyEditingFile)
  Editor.editor.getSelection().setSelectionRange(selection)
}

function syncSelectOptions(options, selectedOption, selectElement) {
  selectElement.innerText = ''

  for (let option of options.sort()) {
    let optionElement = document.createElement('option')
    optionElement.value = option
    optionElement.innerText = option
    selectElement.appendChild(optionElement)
  }

  selectElement.value = selectedOption
}

function updateLinterOptions() {
  let session = Editor.editor.getSession()
  if (session.$worker &&
      session.getMode().$id === "ace/mode/javascript") {
    session.$worker.send("setOptions", [{
      curly: true,
      eqeqeq: true,
      esversion: 6,
      funcscope: false,
      futurehostile: true,
      latedef: 'nofunc',
      nocomma: true,
      notypeof: true,
      varstmt: true,
      // warning codes from https://github.com/jshint/jshint/blob/2.1.4/src/shared/messages.js
      '-W014': true, // allow operator-first style
      '-W033': true, // suppress 'Missing semicolon'

      // relaxing options
      noyield: true,
    }])
  }
}

Files.subscribe(function({filename}) {
  let cur = Editor.currentlyEditingFile

  if (Files.exists(cur)) {
    if (filename === cur) {
      // our current file was edited
      Editor.refresh()
    } else {
      // something else changed; just refresh the select
      // since files may have been added or deleted
      syncSelectOptions(Files.names(), cur, Editor.fileSelector)
    }
  } else {
    // our current file was deleted
    Editor.switchToFile('main.js')
  }
})
