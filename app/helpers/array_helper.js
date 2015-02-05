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

module.exports = {sortBy};