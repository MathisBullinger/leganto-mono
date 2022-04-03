const path = require('path')

module.exports = {
  extends: [
    'prettier',
    'react-app',
    'plugin:react/recommended',
  ],
  plugins: ['@typescript-eslint'],
  parserOptions: {
    project: path.resolve(__dirname, 'tsconfig.json'),
  },
  rules: {
    'prefer-const': 'warn',
    'no-console': 'warn',
    '@typescript-eslint/no-extra-semi': 'off',
    'semi-style': ['error', 'first'],
    'no-debugger': 'warn',
    'no-constant-condition': ['error', { checkLoops: false }],
    //'require-await': 'off',
    //'@typescript-eslint/require-await': 'warn',
    'no-duplicate-imports': 'off',
    '@typescript-eslint/no-duplicate-imports': ['warn'],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
  },
}
