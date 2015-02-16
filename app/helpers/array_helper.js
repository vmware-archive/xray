function diff(oldArr, newArr, id, changeCallback) {
  oldArr = oldArr || [];
  newArr = newArr || [];

  var oldMap = oldArr.reduce((memo, e) => (memo[e[id]] = e, memo), {});
  var newMap = newArr.reduce((memo, e) => (memo[e[id]] = e, memo), {});
  var oldIds = Object.keys(oldMap);
  var newIds = Object.keys(newMap);

  var added = newArr.filter(newEl => !oldIds.includes(newEl[id]));
  var removed = oldArr.filter(oldEl => !newIds.includes(oldEl[id]));
  var changed = changeCallback && oldArr.filter(function(oldEl) {
      var match = newMap[oldEl[id]];
      if (!match) return false;
      return changeCallback(oldEl, match);
    }).map(oldEl => [oldEl, newMap[oldEl[id]]]);

  return {added, removed, changed};
}

module.exports = {diff};