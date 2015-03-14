var React = require('react/addons');
var types = React.PropTypes;

var HoverDesiredLrpMixin = {
  propTypes: {
    desiredLrp: types.object.isRequired,
    $selection: types.object.isRequired
  },

  onMouseEnter() {
    var {desiredLrp, $selection} = this.props;
    $selection.merge({hoverDesiredLrp: desiredLrp});
  },

  onMouseLeave() {
    var {$selection} = this.props;
    $selection.merge({hoverDesiredLrp: null});
  },

  onClick(e) {
    e.stopPropagation();
    var {desiredLrp, $selection} = this.props;
    $selection.merge({selectedDesiredLrp: desiredLrp, sidebarCollapsed: false});
  }
};

module.exports = HoverDesiredLrpMixin;