var React = require('react/addons');
var types = React.PropTypes;

var HoverLrpMixin = {
  propTypes: {
    desiredLrp: types.object.isRequired,
    $hoverLrp: types.object,
    $selectedLrp: types.object
  },

  onMouseEnter() {
    var {desiredLrp, $hoverLrp} = this.props;
    $hoverLrp && $hoverLrp.set(desiredLrp);
  },

  onMouseLeave() {
    var {$hoverLrp} = this.props;
    $hoverLrp && $hoverLrp.set(undefined);
  },

  onClick() {
    var {desiredLrp, $selectedLrp} = this.props;
    $selectedLrp && $selectedLrp.set(desiredLrp);
  }
};

module.exports = HoverLrpMixin;