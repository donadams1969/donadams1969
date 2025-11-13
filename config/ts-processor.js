const ts = require('typescript')

const compilerOptions = {
  jsx: ts.JsxEmit.ReactJSX,
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  esModuleInterop: true,
  removeComments: false,
}

function transpile(text, filename) {
  return ts.transpileModule(text, {
    compilerOptions,
    fileName: filename,
    reportDiagnostics: false,
  })
}

module.exports = {
  processors: {
    transpile: {
      supportsAutofix: false,
      preprocess(text, filename) {
        const { outputText } = transpile(text, filename)
        return [outputText]
      },
      postprocess(messages) {
        return messages[0] ?? []
      },
    },
  },
}
