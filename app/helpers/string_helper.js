var StringHelper = {
  lpad(thing, character, count) {
    var string = thing.toString();
    return (character.repeat(count) + string).slice(-Math.max(count, string.length));
  }
};

module.exports = StringHelper;