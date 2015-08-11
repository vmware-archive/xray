module.exports = {
  isString: (obj) => typeof obj === 'string',

  compact(array) {
    return array.filter(Boolean);
  }
};