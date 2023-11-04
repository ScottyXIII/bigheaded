module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
  settings: {
    'import/resolver': {
      alias: {
        extensions: ['.ts'],
        map: [['@', './src']],
      },
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['prettier', '@typescript-eslint'],
  rules: {
    'import/extensions': 0, // don't require file ext in imports
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }], // stop eslint complaining about deps vs devDeps
  },
  ignorePatterns: ['dist'],
};
