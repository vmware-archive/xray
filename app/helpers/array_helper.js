function sortByHelper(rest, ascending) {
  var key = rest.shift();
  return function(a, b) {
    if(a[key] === b[key]) return rest.length === 0 ? 0 : sortByHelper(rest, ascending)(a, b);
    return ascending * ((a[key] > b[key]) ? 1 : -1);
  }
}

function sortBy(arr, field, options = {ascending: true}) {
  var {ascending} = options;
  ascending = ascending ? 1 : -1;
  return arr.slice(0).sort(sortByHelper(typeof field === 'string' ? [field] : field.slice(0), ascending));
}

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

module.exports = {sortBy, diff};