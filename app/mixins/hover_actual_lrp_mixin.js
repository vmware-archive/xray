var React = require('react/addons');
var types = React.PropTypes;

var HoverActualLrpMixin = {
  propTypes: {
    actualLrp: types.object.isRequired,
    $hoverActualLrp: types.object,
    $hoverSidebarActualLrp: types.object
  },

  onMouseEnter() {
    var {actualLrp, $hoverActualLrp, $hoverSidebarActualLrp} = this.props;
    [$hoverActualLrp, $hoverSidebarActualLrp].filter(Boolean).forEach(cursor => cursor.set(actualLrp));
  },

  onMouseLeave() {
    var {$hoverActualLrp, $hoverSidebarActualLrp} = this.props;
    [$hoverActualLrp, $hoverSidebarActualLrp].filter(Boolean).forEach(cursor => cursor.set(null));
  }
};

module.exports = HoverActualLrpMixin;