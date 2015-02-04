function sortBy(arr, field, options = {ascending: true}) {
  var {ascending} = options;
  ascending = ascending ? 1 : -1;
  return arr.slice(0).sort(function(a, b) {
    if(a[field] === b[field]) return 0;
    return ascending * ((a[field] > b[field]) ? 1 : -1);
  });
}

module.exports = {sortBy};