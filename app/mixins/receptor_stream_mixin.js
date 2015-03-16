var StreamSource = require('../lib/stream_source');
var sortedIndex = require('lodash.sortedindex');
var {actualLrpIndex} = require('../helpers/lrp_helper');

var privates = new WeakMap();

/*eslint-disable no-unused-vars*/
function createResource(cursorName, resourceKey, options = {}) {
  return function({[resourceKey]: resource}) {
    var {$receptor} = this.props;
    var oldResource = $receptor.get(cursorName).find(({modification_tag: {epoch}}) => epoch === resource.modification_tag.epoch);
    if (oldResource) return;

    $receptor.apply(function(receptor) {
      if (options.indexBy) {
        var indexBy = receptor[options.indexBy.name];
        indexBy[resource[options.indexBy.key]] = resource;
      }

      if (options.sortBy) {
        var index = sortedIndex(receptor[cursorName], resource, options.sortBy);
        receptor[cursorName].splice(index, 0, resource);
      } else {
        receptor[cursorName].push(resource);
      }

      return receptor;
    });
  };
}

function removeResource(cursorName, resourceKey, options = {}) {
  return function({[resourceKey]: resource}) {
    var {$receptor} = this.props;
    var oldResource = $receptor.get(cursorName).find(({modification_tag: {epoch}}) => epoch === resource.modification_tag.epoch);
    if (!oldResource) return;
    $receptor.apply(function(receptor) {
      if (options.indexBy) {
        var indexBy = $receptor.get(options.indexBy.name);
        delete indexBy[resource[options.indexBy.key]];
      }

      var index = receptor[cursorName].indexOf(oldResource);
      receptor[cursorName].splice(index, 1);
      return receptor;
    });
  };
}

function changeResource(cursorName, resourceKey, options = {}) {
  return function({[resourceKey]: resource}) {
    var {$receptor} = this.props;
    var oldResource = $receptor.get(cursorName).find(({modification_tag: {epoch}}) => epoch === resource.modification_tag.epoch);
    $receptor.apply(function(receptor) {
      if (!oldResource) {
        if (options.indexBy) {
          var indexBy = receptor[options.indexBy.name];
          indexBy[resource[options.indexBy.key]] = resource;
        }

        receptor[cursorName].push(resource);
      } else {
        var index = receptor[cursorName].indexOf(oldResource);
        receptor[cursorName][index] = resource;
      }
      return receptor;
    });
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

    var options = {
      indexBy: {
        key: 'process_guid',
        name: 'desiredLrpsByProcessGuid'
      }
    };
    sse
      .on('desired_lrp_created', createResource('desiredLrps', 'desired_lrp', options).bind(this))
      .on('desired_lrp_changed', changeResource('desiredLrps', 'desired_lrp_after', options).bind(this))
      .on('desired_lrp_removed', removeResource('desiredLrps', 'desired_lrp', options).bind(this));
  },

  streamSSE(receptorUrl) {
    this.destroySSE();
    this.createSSE(receptorUrl);
    this.streamActualLrps();
    this.streamDesiredLrps();
  }
};

module.exports = ReceptorStreamMixin;