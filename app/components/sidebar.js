var React = require('react/addons');
var DesiredLrpList = require('./desired_lrp_list');
var DesiredLrpDetail = require('./desired_lrp_detail');

var types = React.PropTypes;

var Sidebar = React.createClass({
  propTypes: {
    $receptor: types.object.isRequired
  },

  render() {
    var {$receptor} = this.props;
    var hasDetails = !!$receptor.get('selectedDesiredLrp');
    return (
      <div className="sidebar">
      {!hasDetails && <DesiredLrpList {...this.props}/>}
      {hasDetails && <DesiredLrpDetail {...{$receptor}}/>}
      </div>
    );
  }
});

module.exports = Sidebar;