var max = require('lodash.max');
module.exports = {
  findDesiredLrp(desiredLrps, {modification_tag: {epoch}}) {
    //TODO: desiredLrps could be a hash for O(1) lookup instead of a find
    desiredLrps = desiredLrps.reduce((memo, desiredLrp) => epoch === desiredLrp.modification_tag.epoch ? memo.concat(desiredLrp) : memo, []);
    if (!desiredLrps.length) return null;
    return max(desiredLrps, ({modification_tag: {index}}) => index);
  }
};