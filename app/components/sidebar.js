var React = require('react/addons');
var DesiredLrpList = require('./desired_lrp_list');
var DesiredLrpDetail = require('./desired_lrp_detail');

var types = React.PropTypes;

var Sidebar = React.createClass({
  propTypes: {
    $receptor: types.object.isRequired,
    $selection: types.object.isRequired,
    $sidebar: types.object.isRequired
  },

  render() {
    var {$selection} = this.props;
    var hasDetails = !!$selection.get('selectedDesiredLrp');
    return (
      <div className="sidebar">
        {!hasDetails && <DesiredLrpList {...this.props}/>}
        {hasDetails && <DesiredLrpDetail {...this.props}/>}
      </div>
    );
  }
});

module.exports = Sidebar;