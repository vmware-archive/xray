module.exports = function(func) {
  return function(...args) {
    func(...args);
  };
};