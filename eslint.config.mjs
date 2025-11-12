import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { parseForESLint } = require('./config/ts-parser.js')

const parser = { parseForESLint }

const globals = {
  window: 'readonly',
  document: 'readonly',
  requestAnimationFrame: 'readonly',
  cancelAnimationFrame: 'readonly',
  setTimeout: 'readonly',
  clearTimeout: 'readonly',
}

export default [
  {
    ignores: ['.next/**/*', 'dist/**/*', 'node_modules/**/*', '**/*.d.ts'],
  },
  {
    files: ['config/**/*.js'],
    languageOptions: {
      globals: {
        require: 'readonly',
        module: 'readonly',
      },
    },
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser,
      parserOptions: {
        sourceType: 'module',
      },
      globals,
    },
    rules: {
      'no-unused-vars': 'off',
      'no-undef': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'smart'],
      'no-unreachable': 'error',
      'no-fallthrough': 'error',
      'no-constant-condition': ['error', { checkLoops: false }],
      'no-empty': ['error', { allowEmptyCatch: true }],
      'default-case-last': 'error',
    },
  },
]
