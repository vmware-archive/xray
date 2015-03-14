var BaseApi = require('../api/base_api');
var React = require('react/addons');
var PUI = {Panel: require('../vendor/panels').Panel};
var ReceptorMixin = require('../mixins/receptor_mixin');
var ReceptorStreamMixin = require('../mixins/receptor_stream_mixin');
var Zones = require('./zones');
var Sidebar = require('./sidebar');

var cx = React.addons.classSet;
var types = React.PropTypes;

var Page = React.createClass({
  mixins: [ReceptorMixin, ReceptorStreamMixin],

  propTypes: {
    receptorUrl: types.string,
    $receptor: types.object.isRequired,
    $selection: types.object.isRequired,
    $sidebar: types.object.isRequired
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
    this.props.$selection.merge({selectedDesiredLrp: null, hoverDesiredLrp: null});
  },

  render() {
    var {$receptor, $sidebar, $selection} = this.props;
    var selection = !!($selection.get('hoverDesiredLrp') || $selection.get('selectedDesiredLrp')) || $sidebar.get('filter');
    var sidebarCollapsed = $sidebar.get('sidebarCollapsed');
    return (
      <div className={cx({'page type-neutral-8': true, 'sidebar-collapsed': sidebarCollapsed, 'sidebar-open': !sidebarCollapsed, selection})}>
        <PUI.Panel className="main-panel man panel-scrollable-layout" scrollable={true}>
          <Zones {...{$receptor, $selection, $sidebar}}/>
          {$selection.get('selectedDesiredLrp') && <div className="scrim" onClick={this.onScrimClick}/>}
        </PUI.Panel>
        <PUI.Panel className="sidebar-panel bg-dark-2 man panel-scrollable-layout" padding="pan sidebar-body"><Sidebar {...{$receptor, $selection, $sidebar}}/></PUI.Panel>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Page;
