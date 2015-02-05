var FastMixin = {
  shouldComponentUpdate(nextProps, nextState) {
    var shouldComponentUpdate = [{next: nextProps, current: this.props}, {next: nextState, current: this.state}].some(function({next, current}) {
      return next && Object.keys(next).some(p => next[p] !== current[p]);
    });
    return shouldComponentUpdate;
  }
};

module.exports = FastMixin;