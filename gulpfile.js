require('babel/register')({
  stage: 1,
  ignore: /node_modules|app\/canvas\/[^\/]+\.js$/
});
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var requireDir = require('require-dir');
requireDir('./tasks');
