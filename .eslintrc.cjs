module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'quotes': ["error", "single"],
    'indent': ['error', 2, { SwitchCase: 1 }],
    'object-curly-spacing': ['error', 'always'],
    'max-len': ['warn', { code: 320 }],
    'arrow-spacing': ['error', { before: true, after: true }],
    'eqeqeq': ['error', 'always'],
    'semi': ['error', 'always'],
    'react/jsx-curly-spacing': ['error', 'always'],
    'react/jsx-pascal-case': ['error', { allowAllCaps: true }],
    'prefer-const': 'error',
    'jsx-quotes': ['error', 'prefer-single']
  },
}
