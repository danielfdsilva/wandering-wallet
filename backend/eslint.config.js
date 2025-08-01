const nodePlugin = require('eslint-plugin-n');

module.exports = [
  nodePlugin.configs['flat/recommended-script'],
  {
    rules: {
      'n/exports-style': ['error', 'module.exports']
    }
  }
];
