var React = require('react/addons');
var types = React.PropTypes;

var HoverDesiredLrpMixin = {
  propTypes: {
    desiredLrp: types.object.isRequired,
    $hoverDesiredLrp: types.object,
    $selectedDesiredLrp: types.object
  },

  onMouseEnter() {
    var {desiredLrp, $hoverDesiredLrp} = this.props;
    $hoverDesiredLrp && $hoverDesiredLrp.set(desiredLrp);
  },

  onMouseLeave() {
    var {$hoverDesiredLrp} = this.props;
    $hoverDesiredLrp && $hoverDesiredLrp.set(undefined);
  },

  onClick() {
    var {desiredLrp, $selectedDesiredLrp} = this.props;
    $selectedDesiredLrp && $selectedDesiredLrp.set(desiredLrp);
  }
};

module.exports = HoverDesiredLrpMixin;