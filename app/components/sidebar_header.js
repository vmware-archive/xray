var React = require('react/addons');
var PUI = {Icon: require('../vendor/icon').Icon};

var types = React.PropTypes;

var SidebarHeader = React.createClass({
  propTypes: {
    $receptor: types.object.isRequired
  },

  change(e) {
    var {$receptor} = this.props;
    $receptor.merge({filter: e.target.value});
  },

  toggleSidebar() {
    var {$receptor} = this.props;
    $receptor.merge({sidebarCollapsed: !$receptor.get('sidebarCollapsed')});
  },

  render() {
    var {$receptor} = this.props;
    var value = $receptor.get('filter');
    return (
      <header className="sidebar-header mam">
        <a className="sidebar-toggle mrm txt-c" role="button" onClick={this.toggleSidebar} title="toggle sidebar">
          <span className="sr-only">toggle sidebar</span>
          <PUI.Icon name="angle-double-right" size="2x"/>
        </a>
        <div className="filter-processes">
          <input className="form-control" type="text" placeholder="Filter processes&hellip;" value={value} onChange={this.change}/>
        </div>
      </header>
    );
  }
});

module.exports = SidebarHeader;