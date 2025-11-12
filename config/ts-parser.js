const ts = require('typescript')
const espree = require('espree')
const eslintScope = require('eslint-scope')

const ECMA_VERSION = 2022

function toParserOptions(options = {}) {
  return {
    ecmaVersion: ECMA_VERSION,
    sourceType: options.sourceType ?? 'module',
    ecmaFeatures: { jsx: true, ...(options.ecmaFeatures ?? {}) },
    range: true,
    loc: true,
    tokens: true,
    comment: true,
  }
}

function parseForESLint(code, options = {}) {
  const compilerOptions = {
    jsx: ts.JsxEmit.Preserve,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    allowJs: true,
    removeComments: false,
  }

  const transpiled = ts.transpileModule(code, {
    compilerOptions,
    fileName: options.filePath ?? 'file.tsx',
    transformers: undefined,
    reportDiagnostics: false,
  })

  const parserOptions = toParserOptions(options)
  const ast = espree.parse(transpiled.outputText, parserOptions)
  const scopeManager = eslintScope.analyze(ast, {
    ecmaVersion: parserOptions.ecmaVersion,
    sourceType: parserOptions.sourceType,
    ecmaFeatures: parserOptions.ecmaFeatures,
  })

  return {
    ast,
    scopeManager,
    services: {
      transpiledText: transpiled.outputText,
    },
    visitorKeys: espree.VisitorKeys,
  }
}

module.exports = {
  parseForESLint,
}
