var BaseApi = require('../api/base_api');
var React = require('react/addons');
var PUI = {Panel: require('../vendor/panels').Panel};
var ReceptorMixin = require('../mixins/receptor_mixin');
var ReceptorStreamMixin = require('../mixins/receptor_stream_mixin');
var Sidebar = require('./sidebar');

var cx = React.addons.classSet;
var types = React.PropTypes;

var Page = React.createClass({
  mixins: [ReceptorMixin, ReceptorStreamMixin],

  propTypes: {
    receptorUrl: types.string,
    $receptor: types.object.isRequired
  },

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.receptorUrl && !BaseApi.baseUrl) {
      BaseApi.baseUrl = nextProps.receptorUrl;
      this.updateReceptor();
      this.pollReceptor();
      this.streamSSE(nextProps.receptorUrl);
    }
  },

  onScrimClick() {
    this.props.$receptor.merge({selectedDesiredLrp: null, hoverDesiredLrp: null});
  },

  render() {
    var {$receptor} = this.props;
    var selection = !!($receptor.get('hoverDesiredLrp') || $receptor.get('selectedDesiredLrp')) || $receptor.get('filter');
    var sidebarCollapsed = $receptor.get('sidebarCollapsed');
    return (
      <div className={cx({'page type-neutral-8': true, 'sidebar-collapsed': sidebarCollapsed, 'sidebar-open': !sidebarCollapsed, selection})}>
        <PUI.Panel className="main-panel man panel-scrollable-layout" scrollable={true}>
          {this.props.children}
          {$receptor.get('selectedDesiredLrp') && <div className="scrim" onClick={this.onScrimClick}/>}
        </PUI.Panel>
        <PUI.Panel className="sidebar-panel bg-dark-2 man panel-scrollable-layout" padding="pan sidebar-body"><Sidebar {...{$receptor}}/></PUI.Panel>
      </div>
    );
  }
});

module.exports = Page;
