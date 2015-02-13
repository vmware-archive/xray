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
    this.cleanUpSSE();
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.receptorUrl && !BaseApi.baseUrl) {
      BaseApi.baseUrl = nextProps.receptorUrl;
      this.pollReceptor();
      this.streamSSE(nextProps.receptorUrl);
    }
  },

  cleanUpSSE() {
    var {sse} = privates.get(this) || {};
    if (sse) sse.off();
  },

  streamSSE(receptorUrl) {
    this.cleanUpSSE();
    var sse = new StreamSource(`${receptorUrl}/v1/events`, {withCredentials: true});
    privates.set(this, {sse});
    sse
      .on('actual_lrp_created', parseData(function({actual_lrp}) {
        var {$receptor} = this.props;
        var $actualLrps = $receptor.refine('actualLrps');
        $actualLrps.push(actual_lrp);
      }, this))
      .on('actual_lrp_changed', parseData(function({actual_lrp_after: afterLrp}) {
        var {$receptor} = this.props;
        var $actualLrps = $receptor.refine('actualLrps');
        var oldLrp = $actualLrps.get().find(({modification_tag: {epoch}}) => epoch === afterLrp.modification_tag.epoch);
        $actualLrps.refine(oldLrp).set(afterLrp);
      }, this))
      .on('actual_lrp_removed', parseData(function({actual_lrp}) {
        var {$receptor} = this.props;
        var $actualLrps = $receptor.refine('actualLrps');
        var oldLrp = $actualLrps.get().find(({modification_tag: {epoch}}) => epoch === actual_lrp.modification_tag.epoch);
        $actualLrps.remove(oldLrp);
      }, this))
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
