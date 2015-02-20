var max = require('lodash.max');

function getRoutes(desiredLrp) {
  var routes = desiredLrp.routes;
  if(!routes) {return [];}
  var routers = Object.keys(routes);
  if(!routers.length) {return [];}
  return routes[routers[0]];
}

function matchesRoutes(desiredLrp, filter) {
  var routes = getRoutes(desiredLrp);
  return routes.some(route => route.hostnames.some(hostname => hostname.includes(filter)));
}

module.exports = {
  findLrp(lrps, {modification_tag: {epoch}}) {
    //TODO: desiredLrps could be a hash for O(1) lookup instead of a find
    lrps = lrps.reduce((memo, lrp) => epoch === lrp.modification_tag.epoch ? memo.concat(lrp) : memo, []);
    if (!lrps.length) return null;
    return max(lrps, ({modification_tag: {index}}) => index);
  },

  getRoutes: getRoutes,

  getHostname(desiredLrp) {
    var routes = getRoutes(desiredLrp);
    if(!routes.length) {return null;}
    return routes[0].hostnames[0];
  },

  filterDesiredLrps(desiredLrps, filter) {
    return desiredLrps.filter(desiredLrp => desiredLrp.process_guid.includes(filter) || matchesRoutes(desiredLrp, filter));
  }
};