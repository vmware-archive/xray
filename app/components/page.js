var BaseApi = require('../api/base_api');
var React = require('react/addons');
var ReceptorApi = require('../api/receptor_api');
var {setCorrectingInterval} = require('correcting-interval');
var {diff} = require('../helpers/array_helper');
var Sidebar = require('./sidebar');
var StreamSource = require('../lib/stream_source');
var PUI = {Panel: require('../vendor/panels').Panel};

var types = React.PropTypes;
var cx = React.addons.classSet;

var privates = new WeakMap();

function applyUpdate(newArr, id, changeCallback) {
  return {
    $apply: function(oldArr) {
      var {added, removed, changed} = diff(oldArr, newArr, id, changeCallback);
      var results = oldArr.filter(x => !removed.includes(x));
      if (changed && changed.length) {
        /* jshint unused:false */
        var currentChanged = changed.map(([current, next]) => current);
        var nextChanged = changed.map(([current, next]) => next);
        /* jshint unused:true */
        results = results.map(x => currentChanged.includes(x) ? nextChanged[currentChanged.indexOf(x)] : x);
      }
      return results.concat(added);
    }
  };
}

function parseData(callback, context) {
  return function({data}) {
    callback.call(context, JSON.parse(data));
  };
}

function createResource(cursorName, resourceKey) {
  return function({[resourceKey]: resource}) {
    var {$receptor} = this.props;
    var $cursor = $receptor.refine(cursorName);
    $cursor.push(resource);
  };
}

function removeResource(cursorName, resourceKey) {
  return function({[resourceKey]: resource}) {
    var {$receptor} = this.props;
    var $cursor = $receptor.refine(cursorName);
    var oldResource = $cursor.get().find(({modification_tag: {epoch}}) => epoch === resource.modification_tag.epoch);
    $cursor.remove(oldResource);
  };
}

function changeResource(cursorName, resourceKey) {
  return function({[resourceKey]: resource}) {
    var {$receptor} = this.props;
    var $cursor = $receptor.refine(cursorName);
    var oldResource = $cursor.get().find(({modification_tag: {epoch}}) => epoch === resource.modification_tag.epoch);
    $cursor.refine(oldResource).set(resource);
  };
}

var Page = React.createClass({
  propTypes: {
    receptorUrl: types.string,
    $receptor: types.object.isRequired
  },

  statics: {
    POLL_INTERVAL: 100000
  },

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  },

  componentWillUnmount() {
    this.destroySSE();
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.receptorUrl && !BaseApi.baseUrl) {
      BaseApi.baseUrl = nextProps.receptorUrl;
      this.pollReceptor();
      this.streamSSE(nextProps.receptorUrl);
    }
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
  },

  updateReceptor() {
    var {$receptor} = this.props;
    return ReceptorApi.fetch()
      .then(function({actualLrps, cells, desiredLrps}) {
        $receptor.update({
          cells: applyUpdate(cells, 'cell_id'),
          actualLrps: applyUpdate(actualLrps, 'instance_guid', (a, b) => a.since !== b.since),
          desiredLrps: applyUpdate(desiredLrps, 'process_guid')
        });
      }.bind(this))
      .catch(reason => console.error('Receptor Promise failed because', reason));
  },

  pollReceptor() {
    this.updateReceptor();
    setCorrectingInterval(this.updateReceptor, Page.POLL_INTERVAL);
  },

  render() {
    var {$receptor} = this.props;
    return (
      <div className={cx({'page type-neutral-8': true, selection: !!$receptor.get('selectedLrp')})}>
        <PUI.Panel className="main-panel man" scrollable={true}>{this.props.children}</PUI.Panel>
        <PUI.Panel className="sidebar-panel bg-dark-2 man" padding="pan sidebar-body"><Sidebar {...{$receptor}}/></PUI.Panel>
      </div>
    );
  }
});

module.exports = Page;
