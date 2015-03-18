var BaseApi = require('../api/base_api');
var Footer = require('./footer');
var React = require('react/addons');
var PureRenderMixin = require('../mixins/pure_render_mixin');
var ReceptorMixin = require('../mixins/receptor_mixin');
var ReceptorStreamMixin = require('../mixins/receptor_stream_mixin');
var Zones = require('./zones');
var Sidebar = require('./sidebar');
var {mergeClassNames} = require('../helpers/react_helper');

var cx = React.addons.classSet;
var types = React.PropTypes;

var Page = React.createClass({
  mixins: [PureRenderMixin, ReceptorMixin, ReceptorStreamMixin],

  propTypes: {
    receptorUrl: types.string,
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
    var {$receptor, $scaling, $sidebar, $selection} = this.props;
    var selection = !!($selection.get('hoverDesiredLrp') || $selection.get('selectedDesiredLrp')) || $sidebar.get('filter');
    var sidebarCollapsed = $sidebar.get('sidebarCollapsed');

    var highlightDesiredLrp = [$selection.get().selectedDesiredLrp || $selection.get().hoverDesiredLrp]
      .filter(Boolean)
      .map(desiredLrp => `show-app-${desiredLrp.processNumber}`);

    var filteredLrps = ($selection.get('filteredLrps') || []).map(function(item){
      return `show-app-${item.processNumber}`;
    });

    var classes = mergeClassNames(
      'page',
      cx({
        'sidebar-collapsed': sidebarCollapsed,
        'sidebar-open': !sidebarCollapsed,
        'filtered': $sidebar.get('filter'),
        selection
      }),
      ...filteredLrps,
      ...highlightDesiredLrp
    );

    return (
      <div className={classes}>
        <article className="main-panel">
          <Zones {...{$receptor, $selection, $sidebar, scaling: $scaling.get()}}/>
          <Footer {...{$receptor, $scaling}}/>
          {$selection.get('selectedDesiredLrp') && <div className="scrim" onClick={this.onScrimClick}/>}
        </article>
        <aside className="sidebar-panel"><Sidebar {...{$receptor, $selection, $sidebar}}/></aside>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Page;
