var FastMixin = {
  shouldComponentUpdate(nextProps, nextState) {
    var shouldComponentUpdate = [{next: nextProps, current: this.props}, {next: nextState, current: this.state}].some(function({next, current}) {
      var changedKeys = next && Object.keys(next).filter(p => next[p] !== current[p]);
      console.log('changedKeys', changedKeys)
      return next && Object.keys(next).some(p => next[p] !== current[p]);
    });
    console.log('shouldComponentUpdate', shouldComponentUpdate);
    return shouldComponentUpdate;
  }
};

module.exports = FastMixin;