var max = require('lodash.max');
var {lpad} = require('./string_helper');
var flatten = require('lodash.flatten');

function getRoutes(desiredLrp) {
  var routes = desiredLrp.routes;
  if (!routes) return [];
  var routers = Object.keys(routes);
  if (!routers.length) return [];
  return routes[routers[0]];
}

module.exports = {
  findLrp(lrps, {modification_tag: {epoch}}) {
    //TODO: desiredLrps could be a hash for O(1) lookup instead of a find
    lrps = lrps.reduce((memo, lrp) => epoch === lrp.modification_tag.epoch ? memo.concat(lrp) : memo, []);
    if (!lrps.length) return null;
    return max(lrps, ({modification_tag: {index}}) => index);
  },

  actualLrpIndex: lrp => lrp.process_guid + lpad(lrp.index, '0', 5),

  decorateDesiredLrp(lrp) {
    var routes = getRoutes(lrp);
    var hostnames = flatten(routes.map(route => route.hostnames));
    lrp.filterString = [lrp.process_guid].concat(hostnames).join('|');
  },
  getRoutes: getRoutes,

  getHostname(desiredLrp) {
    var routes = getRoutes(desiredLrp);
    if (!routes.length) return null;
    return routes[0].hostnames[0];
  },

  filterDesiredLrps(desiredLrps, filter) {
    return desiredLrps.filter(desiredLrp => desiredLrp.filterString.includes(filter));
  }
};