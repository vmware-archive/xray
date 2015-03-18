var PureRenderMixin = require('../mixins/pure_render_mixin');
var PUI = {Icon: require('../vendor/icon').Icon};
var React = require('react/addons');
var helper = require('../helpers/lrp_helper');

var types = React.PropTypes;

var SidebarHeader = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    $receptor: types.object.isRequired,
    $selection: types.object.isRequired,
    $sidebar: types.object.isRequired
  },

  change(e) {
    var {$receptor, $selection, $sidebar} = this.props;
    var desiredLrps = $receptor.get().desiredLrps;
    var filter = e.target.value;
    $sidebar.merge({filter: filter});
    $selection.merge({filteredLrps: helper.filterDesiredLrps(desiredLrps, filter)});
  },

  toggleSidebar() {
    var {$sidebar} = this.props;
    $sidebar.merge({sidebarCollapsed: !$sidebar.get('sidebarCollapsed')});
  },

  render() {
    var {$sidebar} = this.props;
    var filter = $sidebar.get('filter');
    return (
      <header className="sidebar-header mam">
        <a className="sidebar-toggle mrm txt-c" role="button" onClick={this.toggleSidebar} title="toggle sidebar">
          <span className="sr-only">toggle sidebar</span>
          <PUI.Icon name="angle-double-right" />
        </a>
        <div className="filter-processes">
          <input className="form-control" type="text" placeholder="Filter processes&hellip;" value={filter} onChange={this.change}/>
        </div>
      </header>
    );
  }
});

module.exports = SidebarHeader;