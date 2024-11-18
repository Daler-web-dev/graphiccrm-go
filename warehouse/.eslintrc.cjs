module.exports = {
  root: true,
  env: {
    browser: true,
    node: true, // Разрешает использование CommonJS
    es2020: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      {
        allowConstantExport: true
      },
    ],
    'indent': ['error', 'tab'],
    '@typescript-eslint/indent': ['error', 'tab'],
  },
};