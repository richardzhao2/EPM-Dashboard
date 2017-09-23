module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    mocha: true,
    jquery: true,
  },
  extends: [
    'eslint:recommended',
  ],
  parser: 'babel-eslint',  
  parserOptions: {
    sourceType: 'module',
    allowImportExportEverywhere: true,    
  },
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    indent: ['error', 2],
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
    'no-unused-vars': ['warn'],
    'no-console': 0,
    // 'no-trailing-spaces': ['error'], NOT for this hackathon lol
  },
};