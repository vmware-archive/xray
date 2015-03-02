function hashCode(str) {
  return str.split('').reduce(function(a, b) {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
}

module.exports = {
  pickColor(colors, str) {
    return colors[(Math.abs(hashCode(str + '')) % colors.length)];
  }
};
