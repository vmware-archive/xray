function diff(oldArr, newArr, id, changeCallback) {
  oldArr = oldArr || [];
  newArr = newArr || [];

  var oldMap = oldArr.reduce((memo, e) => (memo[e[id]] = e) && memo, {});
  var newMap = newArr.reduce((memo, e) => (memo[e[id]] = e) && memo, {});
  var oldIds = Object.keys(oldMap);
  var newIds = Object.keys(newMap);

  var added = newArr.filter(newEl => oldIds.indexOf(newEl[id]) === -1);
  var removed = oldArr.filter(oldEl => newIds.indexOf(oldEl[id]) === -1);
  var changed = changeCallback && newArr.filter(function(newEl) {
      var match = oldMap[newEl[id]];
      if (!match) return false;
      return changeCallback(match, newEl);
    });

  return {added, removed, changed};
}

module.exports = {diff};