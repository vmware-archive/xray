var FastMixin = {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    var propsOrStateChanged = [{next: nextProps, current: this.props}, {next: nextState, current: this.state}].some(function({next, current}) {
      return next && Object.keys(next).some(p => next[p] !== current[p]);
    });
    var contextChanged = (this.context && (this.context.scaling !== nextContext.scaling));
    return propsOrStateChanged || contextChanged;
  }
};

module.exports = FastMixin;