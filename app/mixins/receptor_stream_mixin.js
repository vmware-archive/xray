var StreamSource = require('../lib/stream_source');
var sortedIndex = require('lodash.sortedindex');
var {actualLrpIndex} = require('../helpers/lrp_helper');

var privates = new WeakMap();

/*eslint-disable no-unused-vars*/
function createResource(cursorName, resourceKey, options = {}) {
  return function({[resourceKey]: resource}) {
    var {$receptor} = this.props;
    var $cursor = $receptor.refine(cursorName);
    var oldResource = $cursor.get().find(({modification_tag: {epoch}}) => epoch === resource.modification_tag.epoch);
    if (oldResource) return;
    if (options.sortBy) {
      var index = sortedIndex($cursor.get(), resource, options.sortBy);
      $cursor.splice([index, 0, resource]);
      return;
    }
    $cursor.push(resource);
  };
}

function removeResource(cursorName, resourceKey) {
  return function({[resourceKey]: resource}) {
    var {$receptor} = this.props;
    var $cursor = $receptor.refine(cursorName);
    var oldResource = $cursor.get().find(({modification_tag: {epoch}}) => epoch === resource.modification_tag.epoch);
    if (!oldResource) return;
    $cursor.remove(oldResource);
  };
}

function changeResource(cursorName, resourceKey) {
  return function({[resourceKey]: resource}) {
    var {$receptor} = this.props;
    var $cursor = $receptor.refine(cursorName);
    var oldResource = $cursor.get().find(({modification_tag: {epoch}}) => epoch === resource.modification_tag.epoch);
    if (!oldResource) {
      $cursor.push(resource);
      return;
    }
    $cursor.refine(oldResource).set(resource);
  };
}
/*eslint-enable no-unused-vars*/

var ReceptorStreamMixin = {
  componentWillUnmount() {
    this.destroySSE();
  },

  createSSE(receptorUrl) {
    var sse = new StreamSource(`${receptorUrl}/v1/events`, {withCredentials: true});
    privates.set(this, {sse});
  },

  destroySSE() {
    var {sse} = privates.get(this) || {};
    if (sse) sse.off();
  },

  streamActualLrps() {
    var {sse} = privates.get(this) || {};
    if (!sse) return;

    sse
      .on('actual_lrp_created', createResource('actualLrps', 'actual_lrp', {sortBy: actualLrpIndex}).bind(this))
      .on('actual_lrp_changed', changeResource('actualLrps', 'actual_lrp_after').bind(this))
      .on('actual_lrp_removed', removeResource('actualLrps', 'actual_lrp').bind(this));
  },

  streamDesiredLrps() {
    var {sse} = privates.get(this) || {};
    if (!sse) return;

    sse
      .on('desired_lrp_created', createResource('desiredLrps', 'desired_lrp').bind(this))
      .on('desired_lrp_changed', changeResource('desiredLrps', 'desired_lrp_after').bind(this))
      .on('desired_lrp_removed', removeResource('desiredLrps', 'desired_lrp').bind(this));
  },

  streamSSE(receptorUrl) {
    this.destroySSE();
    this.createSSE(receptorUrl);
    this.streamActualLrps();
    this.streamDesiredLrps();
  }
};

module.exports = ReceptorStreamMixin;