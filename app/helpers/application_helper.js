/* jshint ignore:start */
function hashCode(str) {
  return str.split('').reduce(function(a, b) {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a
  }, 0);
}
/* jshint ignore:end */
module.exports = {
/* jshint ignore:start */
  pickColor(colors, str) {
    return colors[(Math.abs(hashCode(str + '')) % colors.length)];
  }
/* jshint ignore:end */
};
