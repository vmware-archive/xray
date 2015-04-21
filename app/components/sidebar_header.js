var Filter = require('./filter');
var Icon = require('pui-react-iconography').Icon;
var PureRenderMixin = require('pui-cursor/mixins/pure-render-mixin');
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

  filter(e) {
    var {$receptor, $selection, $sidebar} = this.props;
    var desiredLrps = $receptor.get().desiredLrps;
    var filter = e.target.value;
    $sidebar.merge({filter: filter});
    var filteredLrps = filter.length ?
      helper.filterDesiredLrps(desiredLrps, filter) : {};
    $selection.merge({filteredLrps});
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
        <a className="form-control sidebar-toggle txt-c" role="button" onClick={this.toggleSidebar} title="toggle sidebar">
          <span className="sr-only">toggle sidebar</span>
          <Icon name="angle-double-right" />
        </a>
        <Filter className="filter-processes" placeholder="Filter &hellip;" value={filter} onFilter={this.filter}/>
      </header>
    );
  }
});

module.exports = SidebarHeader;