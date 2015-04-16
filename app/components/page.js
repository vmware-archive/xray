var BaseApi = require('../api/base_api');
var Header = require('./header');
var Footer = require('./footer');
var Scaling = require('./scaling');
var React = require('react/addons');
var PureRenderMixin = require('../mixins/pure_render_mixin');
var ReceptorMixin = require('../mixins/receptor_mixin');
var ReceptorStreamMixin = require('../mixins/receptor_stream_mixin');
var ReceptorUrl = require('./receptor_url');
var Zones = require('./zones');
var Sidebar = require('./sidebar');
var classnames = require('classnames');

var types = React.PropTypes;

var Page = React.createClass({
  mixins: [PureRenderMixin, ReceptorMixin, ReceptorStreamMixin],

  propTypes: {
    receptorUrl: types.string.isRequired,
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
    var {receptorUrl, $receptor, $scaling, $sidebar, $selection} = this.props;
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
        <Header className="main-header">
          <ReceptorUrl receptorUrl={receptorUrl}/>
        </Header>
        <section className="main-content">
          <article className="main-panel">
            <Zones {...{$receptor, $selection, $sidebar, scaling: $scaling.get()}}/>
            <Scaling {...{$receptor, $scaling}}/>
            {$selection.get('selectedDesiredLrp') && <div className="scrim" onClick={this.onScrimClick}/>}
          </article>
          <aside className="sidebar-panel"><Sidebar {...{$receptor, $selection, $sidebar}}/></aside>
        </section>
        <Footer className="main-footer"/>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Page;
