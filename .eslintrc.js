/* eslint-env node */

module.exports = {
  root: true,
  extends: ['eslint:recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json', './app/tsconfig.json', './api/tsconfig.json'],
    createDefaultProgram: true
  },
}
