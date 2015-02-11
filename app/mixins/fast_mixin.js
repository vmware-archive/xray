var Cursor = require('../lib/cursor');

function isEqual(next, current, ignore) {
  return function(p) {
    if (ignore.includes(p)) return false;
    if (next[p] instanceof Cursor && current[p] instanceof Cursor) {
      return !next[p].isEqual(current[p]);
    }
    return next[p] !== current[p];
  };
}

var FastMixin = {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return [
      {next: nextProps, current: this.props, type: 'Props'},
      {next: nextState, current: this.state, type: 'State'},
      {next: nextContext, current: this.context, type: 'Context'}].some(function({next, current, type}) {
        var ignore = `ignoreFast${type}`;
        return next && Object.keys(next).some(isEqual(next, current, this[ignore] || []));
      }, this);
  }
};

module.exports = FastMixin;