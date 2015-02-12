require('node-jsx').install({harmony: true});
require('6to5/register')({
  ignore: /(?:node_modules|vendor)/
});
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var requireDir = require('require-dir');
requireDir('./tasks');
