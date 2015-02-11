var Cursor = require('../lib/cursor');

function isEqual(next, current) {
  return function(p) {
    if (next[p] instanceof Cursor && current[p] instanceof Cursor) {
      return !next[p].isEqual(current[p]);
    }
    return next[p] !== current[p];
  };
}

var FastMixin = {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return [
      {next: nextProps, current: this.props},
      {next: nextState, current: this.state},
      {next: nextContext, current: this.context}].some(function({next, current}) {
        return next && Object.keys(next).some(isEqual(next, current));
      });
  }
};

module.exports = FastMixin;