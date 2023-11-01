module.exports = {
  root: true,
  env: { browser: true, es2020: true },
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
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-explicit-any': 'warn',
    'indent': ['warn', 2],
    'semi': [
      'warn', 'always', {
        omitLastInOneLineClassBody: true
      }
    ],
    'comma-dangle': [
      'warn',
      {
        'arrays': 'always',
        'objects': 'always',
        'imports': 'never',
        'exports': 'never',
        'functions': 'never'
      }
    ],
    'no-duplicate-imports': ['warn'],
    'no-console': ['warn', { 'allow': ['warn', 'error'] }],
    'no-eval': ['warn', { 'allowIndirect': true }],
    'no-debugger': 'error',
    'require-await': 'warn',
    'no-promise-executor-return': 'warn'
  },
}
