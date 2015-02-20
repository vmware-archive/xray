var StreamSource = require('../lib/stream_source');

var privates = new WeakMap();

function parseData(callback, context) {
  return function({data}) {
    callback.call(context, JSON.parse(data));
  };
}

function createResource(cursorName, resourceKey) {
  return function({[resourceKey]: resource}) {
    var {$receptor} = this.props;
    var $cursor = $receptor.refine(cursorName);
    var oldResource = $cursor.get().find(({modification_tag: {epoch}}) => epoch === resource.modification_tag.epoch);
    if (oldResource) return;
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
      .on('actual_lrp_created', parseData(createResource('actualLrps', 'actual_lrp'), this))
      .on('actual_lrp_changed', parseData(changeResource('actualLrps', 'actual_lrp_after'), this))
      .on('actual_lrp_removed', parseData(removeResource('actualLrps', 'actual_lrp'), this));
  },

  streamDesiredLrps() {
    var {sse} = privates.get(this) || {};
    if (!sse) return;

    sse
      .on('desired_lrp_created', parseData(createResource('desiredLrps', 'desired_lrp'), this))
      .on('desired_lrp_changed', parseData(changeResource('desiredLrps', 'desired_lrp_after'), this))
      .on('desired_lrp_removed', parseData(removeResource('desiredLrps', 'desired_lrp'), this));
  },

  streamSSE(receptorUrl) {
    this.destroySSE();
    this.createSSE(receptorUrl);
    this.streamActualLrps();
    this.streamDesiredLrps();
  }
};

module.exports = ReceptorStreamMixin;