module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    'no-var': 'error',
    'no-unused-vars': 'warn',
    'max-classes-per-file': 'off',
    'no-prototype-builtins': 'warn',
    'import/extensions': ['error', 'always', { js: 'allow' }],
  },
};
