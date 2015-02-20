var BaseApi = require('../api/base_api');
var React = require('react/addons');
var PUI = {Panel: require('../vendor/panels').Panel};
var ReceptorMixin = require('../mixins/receptor_mixin');
var Sidebar = require('./sidebar');
var StreamSource = require('../lib/stream_source');

var cx = React.addons.classSet;
var types = React.PropTypes;

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

var Page = React.createClass({
  mixins: [ReceptorMixin],

  propTypes: {
    receptorUrl: types.string,
    $receptor: types.object.isRequired
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
      this.updateReceptor();
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

  onScrimClick() {
    this.props.$receptor.merge({selectedDesiredLrp: null, hoverDesiredLrp: null});
  },

  render() {
    var {$receptor} = this.props;
    var selection = !!($receptor.get('hoverDesiredLrp') || $receptor.get('selectedDesiredLrp'));
    return (
      <div className={cx({'page type-neutral-8': true, 'sidebar-collapsed': $receptor.get('sidebarCollapsed'), selection})}>
        <PUI.Panel className="main-panel man" scrollable={true}>
          {this.props.children}
          {$receptor.get('selectedDesiredLrp') && <div className="scrim" onClick={this.onScrimClick}/>}
        </PUI.Panel>
        <PUI.Panel className="sidebar-panel bg-dark-2 man" padding="pan sidebar-body"><Sidebar {...{$receptor}}/></PUI.Panel>
      </div>
    );
  }
});

module.exports = Page;
