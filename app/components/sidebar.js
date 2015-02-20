var React = require('react/addons');
var DesiredLrpList = require('./desired_lrp_list');
var DesiredLrpDetail = require('./desired_lrp_detail');
var PUI = {Icon: require('../vendor/icon').Icon};
var SidebarHeader = require('./sidebar_header');

var types = React.PropTypes;

var Sidebar = React.createClass({
  propTypes: {
    $receptor: types.object.isRequired
  },

  toggleSidebar() {
    var {$receptor} = this.props;
    $receptor.refine('sidebarCollapsed').set(!$receptor.get('sidebarCollapsed'));
  },

  render() {
    var {$receptor} = this.props;
    var hasDetails = !!$receptor.get('selectedDesiredLrp');
    return (
      <div className="sidebar">
        <SidebarHeader $filter={$receptor.refine('filter')} hasDetails={hasDetails}>
          <a className="sidebar-toggle mrm txt-c" role="button" onClick={this.toggleSidebar} title="toggle sidebar">
            <span className="sr-only">toggle sidebar</span>
            <PUI.Icon name="angle-double-right" size="2x"/>
          </a>
        </SidebarHeader>
        {!hasDetails && <DesiredLrpList {...this.props}/>}
        {hasDetails && <DesiredLrpDetail {...{$receptor}}/>}
      </div>
    );
  }
});

module.exports = Sidebar;