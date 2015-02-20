var React = require('react/addons');
var types = React.PropTypes;

var HoverDesiredLrpMixin = {
  propTypes: {
    desiredLrp: types.object.isRequired,
    $receptor: types.object.isRequired
  },

  onMouseEnter() {
    var {desiredLrp, $receptor} = this.props;
    $receptor.merge({hoverDesiredLrp: desiredLrp});
  },

  onMouseLeave() {
    var {$receptor} = this.props;
    $receptor.merge({hoverDesiredLrp: null});
  },

  onClick() {
    var {desiredLrp, $receptor} = this.props;
    $receptor.merge({selectedDesiredLrp: desiredLrp, sidebarCollapsed: false});
  }
};

module.exports = HoverDesiredLrpMixin;