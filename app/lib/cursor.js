var React = require('react/addons');

var update = React.addons.update;
var privates = new WeakMap();

class Cursor {
  constructor(data, callback, path = []) {
    privates.set(this, {data, path, callback});
  }

  refine(...path) {
    var {callback, data} = privates.get(this);
    if (path.some(p => typeof p === 'object')) {
      path = path.map((p, i) => typeof p !== 'object' ? p : this.get(path[i - 1]).indexOf(p));
      return new Cursor(data, callback, path);
    }
    return new Cursor(data, callback, path);
  }

  get(...morePath) {
    var {data, path} = privates.get(this);
    return path.concat(morePath).reduce((memo, step) => memo[step], data);
  }

  isEqual(otherCursor) {
    return this.get() === otherCursor.get();
  }

  apply(options) {
    return this.update({$apply: options});
  }

  merge(options) {
    return this.update({$merge: options});
  }

  set(options) {
    return this.update({$set: options});
  }

  push(...options) {
    return this.update({$push: options});
  }

  unshift(...options) {
    return this.update({$unshift: options});
  }

  update(options) {
    var {callback, data, path} = privates.get(this);
    var query = path.reduceRight((memo, step) => ({[step]: Object.assign({}, memo)}), options);
    callback(update(data, query));
    return this;
  }
}

module.exports = Cursor;