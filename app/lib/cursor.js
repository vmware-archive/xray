var React = require('react/addons');

var update = React.addons.update;
var privates = new WeakMap();

class Cursor {
  constructor(data, callback, path = []) {
    privates.set(this, {data, path, callback});
  }

  refine(...query) {
    var {callback, data, path} = privates.get(this);
    if (query.some(p => typeof p === 'object')) {
      query = query.map((p, i) => typeof p !== 'object' ? p : (!i ? this.get() : this.get(query[i - 1])).indexOf(p));
      return new Cursor(data, callback, path.concat(query));
    }
    return new Cursor(data, callback, path.concat(query));
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

  remove(object) {
    return this.splice(this.get().indexOf(object), 1);
  }

  splice(...options) {
    return this.update({$splice: [options]});
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