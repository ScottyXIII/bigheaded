module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
    'prettier',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
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
    'no-param-reassign': ['error', { props: false }], // Phaser requirement
    'no-shadow': 'off',
  },
  ignorePatterns: ['dist'],
};
