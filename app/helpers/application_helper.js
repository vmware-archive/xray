var flatten = require('lodash.flatten');
var React = require('react/addons');

var cx = React.addons.classSet;

/* jshint ignore:start */
function hashCode(str) {
  return str.split('').reduce(function(a, b) {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a
  }, 0);
}
/* jshint ignore:end */
module.exports = {
/* jshint ignore:start */
  pickColor(colors, str) {
    return colors[(Math.abs(hashCode(str + '')) % colors.length)];
  },
/* jshint ignore:end */
  mergeClassNames(...classNames) {
    return cx(flatten(classNames.map(name => (name || '').split(/\s+/))).reduce((memo, c) => (memo[c] = true) && memo, {}));
  }
};
