module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: ['plugin:vue/essential', '@vue/prettier'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    semi: 'off', // 0 = off, 1 = warn, 2 = error
    quotes: 'off'
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals: {
    // use ActiveXObject instead of window.ActiveXObject to get around the global.
    window: true,
    ActiveXObject: true
  }
}
