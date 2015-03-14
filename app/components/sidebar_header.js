var React = require('react/addons');
var PUI = {Icon: require('../vendor/icon').Icon};

var types = React.PropTypes;

var SidebarHeader = React.createClass({
  propTypes: {
    $sidebar: types.object.isRequired
  },

  change(e) {
    var {$sidebar} = this.props;
    $sidebar.merge({filter: e.target.value});
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
          <PUI.Icon name="angle-double-right" size="2x"/>
        </a>
        <div className="filter-processes">
          <input className="form-control" type="text" placeholder="Filter processes&hellip;" value={filter} onChange={this.change}/>
        </div>
      </header>
    );
  }
});

module.exports = SidebarHeader;