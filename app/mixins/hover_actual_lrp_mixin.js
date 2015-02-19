var React = require('react/addons');
var types = React.PropTypes;

var HoverActualLrpMixin = {
  propTypes: {
    actualLrp: types.object.isRequired,
    $hoverActualLrp: types.object
  },

  onMouseEnter() {
    var {actualLrp, $hoverActualLrp} = this.props;
    $hoverActualLrp && $hoverActualLrp.set(actualLrp);
  },

  onMouseLeave() {
    var {$hoverActualLrp} = this.props;
    $hoverActualLrp && $hoverActualLrp.set(null);
  }
};

module.exports = HoverActualLrpMixin;