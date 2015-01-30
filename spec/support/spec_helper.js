global.Factory = require('rosie').Factory;

if (typeof window !== 'undefined') {
  var factories = require.context('../factories', true, /\.js$/);
  factories.keys().forEach(factories);
} else {
  var requireDir = require('require-dir');
  requireDir('../factories');
}