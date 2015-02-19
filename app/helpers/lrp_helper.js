var max = require('lodash.max');
module.exports = {
  findLrp(lrps, {modification_tag: {epoch}}) {
    //TODO: desiredLrps could be a hash for O(1) lookup instead of a find
    lrps = lrps.reduce((memo, lrp) => epoch === lrp.modification_tag.epoch ? memo.concat(lrp) : memo, []);
    if (!lrps.length) return null;
    return max(lrps, ({modification_tag: {index}}) => index);
  }
};