var FastMixin = {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    return [
      {next: nextProps, current: this.props},
      {next: nextState, current: this.state},
      {next: nextContext, current: this.context}].some(function({next, current}) {
        return next && Object.keys(next).some(p => next[p] !== current[p]);
      });
  }
};

module.exports = FastMixin;