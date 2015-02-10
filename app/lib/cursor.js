var privates = new WeakMap();

class Cursor {
  constructor(data, path = []) {
    privates.set(this, {data, path});
  }

  refine(...path) {
    var {data} = privates.get(this);
    return new Cursor(data, path);
  }

  get(...morePath) {
    var {data, path} = privates.get(this);
      return path.concat(morePath).reduce(function(memo, step) {
      return memo[step];
    }, data);
  }
}

module.exports = Cursor;