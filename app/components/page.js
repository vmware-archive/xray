var BaseApi = require('../api/base_api');
var classnames = require('classnames');
var Cursor = require('pui-cursor');
var BaseApi = require('../api/base_api');
var Header = require('./header');
var Footer = require('./footer');
var LaunchModal = require('./launch_modal');
var Scaling = require('./scaling');
var React = require('react');
var PureRenderMixin = require('pui-cursor/mixins/pure-render-mixin');
var ReceptorMixin = require('../mixins/receptor_mixin');
var ReceptorStreamMixin = require('../mixins/receptor_stream_mixin');
var Sidebar = require('./sidebar');
var Zones = require('./zones');

var types = React.PropTypes;

var Page = React.createClass({
  mixins: [PureRenderMixin, ReceptorMixin, ReceptorStreamMixin],

  propTypes: {
    selectedReceptor: types.object.isRequired,
    receptorUrl: types.string.isRequired,
    $currentTime: types.object.isRequired,
    $receptor: types.object.isRequired,
    $scaling: types.object.isRequired,
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
    var {receptorUrl, selectedReceptor, $scaling, $sidebar, $selection} = this.props;
    var $selectedReceptor = new Cursor(selectedReceptor, () => {});
    var selection = !!($selection.get('hoverDesiredLrp') || $selection.get('selectedDesiredLrp')) || $sidebar.get('filter');
    var sidebarCollapsed = $sidebar.get('sidebarCollapsed');

    var classes = classnames(
      'page',
      {
        'sidebar-collapsed': sidebarCollapsed,
        'sidebar-open': !sidebarCollapsed,
        'filtered': $sidebar.get('filter'),
        selection
      }
    );

    return (
      <div className={classes}>
        <Header className="main-header type-neutral-11">
          <LaunchModal title="Edit Receptor" receptorUrl={receptorUrl}>Edit Receptor</LaunchModal>
        </Header>
        <section className="main-content type-neutral-11">
          <article className="main-panel">
            <Zones {...{$receptor: $selectedReceptor, $selection, $sidebar, scaling: $scaling.get()}}/>
            <Scaling {...{$receptor: $selectedReceptor, $scaling}}/>
            {$selection.get('selectedDesiredLrp') && <div className="scrim" onClick={this.onScrimClick}/>}
          </article>
          <aside className="sidebar-panel"><Sidebar {...{$receptor: $selectedReceptor, $selection, $sidebar}}/></aside>
        </section>
        <Footer className="main-footer"/>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Page;

var Header = require('./header');
var Footer = require('./footer');
var LaunchModal = require('./launch_modal');
var Scaling = require('./scaling');
var React = require('react');
var PureRenderMixin = require('pui-cursor/mixins/pure-render-mixin');
var ReceptorMixin = require('../mixins/receptor_mixin');
var ReceptorStreamMixin = require('../mixins/receptor_stream_mixin');
var Sidebar = require('./sidebar');
var Slider = require('./slider');
var Zones = require('./zones');

var types = React.PropTypes;

var Page = React.createClass({
  mixins: [PureRenderMixin, ReceptorMixin, ReceptorStreamMixin],

  propTypes: {
    selectedReceptor: types.object.isRequired,
    receptorUrl: types.string.isRequired,
    $slider: types.object.isRequired,
    $receptor: types.object.isRequired,
    $scaling: types.object.isRequired,
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
    var {receptorUrl, selectedReceptor, $scaling, $sidebar, $selection, $slider} = this.props;
    var $selectedReceptor = new Cursor(selectedReceptor, () => {});
    var selection = !!($selection.get('hoverDesiredLrp') || $selection.get('selectedDesiredLrp')) || $sidebar.get('filter');
    var sidebarCollapsed = $sidebar.get('sidebarCollapsed');

    var classes = classnames(
      'page',
      {
        'sidebar-collapsed': sidebarCollapsed,
        'sidebar-open': !sidebarCollapsed,
        'filtered': $sidebar.get('filter'),
        selection
      }
    );

    return (
      <div className={classes}>
        <Header className="main-header type-neutral-11">
          <LaunchModal title="Edit Receptor" receptorUrl={receptorUrl}>Edit Receptor</LaunchModal>
        </Header>
        <section className="main-content type-neutral-11">
          <article className="main-panel">
            <Zones {...{$receptor: $selectedReceptor, $selection, $sidebar, scaling: $scaling.get()}}/>
            <Slider {...{$slider}}/>
            <Scaling {...{$receptor: $selectedReceptor, $scaling}}/>
            {$selection.get('selectedDesiredLrp') && <div className="scrim" onClick={this.onScrimClick}/>}
          </article>
          <aside className="sidebar-panel"><Sidebar {...{$receptor: $selectedReceptor, $selection, $sidebar}}/></aside>
        </section>
        <Footer className="main-footer"/>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Page;
