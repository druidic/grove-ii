function Program(code, {printer, display, filesystem}) {
  var eventGenerator = null
  var event = null
  var outputCallback = function() {}

  var api = {
    answer: null,
    promptInteger: () => 'promptInteger',
    print: text => printer.print(text),
    cut: () => printer.cut(),
    display:
  }

  return {
    onOutput: cb => outputCallback = cb,
    run,
    input,
  }

  function run(functionName) {
    var functions = {}
    new Function('program', code)(functions)
    eventGenerator = functions[functionName](api)
    event = eventGenerator.next().value
  }

  function input(value) {
    if (event === 'promptInteger') {
      api.answer = parseInt(value)
      event = eventGenerator.next().value
    }
  }
}
