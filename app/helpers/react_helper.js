var flatten = require('lodash.flatten');
var React = require('react/addons');

var cx = React.addons.classSet;

module.exports = {
  mergeClassnames(...classNames) {
    return cx(flatten(classNames.map(name => (name || '').split(/\s+/))).reduce((memo, c) => ((memo[c] = true),  memo), {}));
  }
};