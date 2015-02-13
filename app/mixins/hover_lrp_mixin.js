var React = require('react/addons');
var types = React.PropTypes;

var HoverLrpMixin = {
  propTypes: {
    desiredLrp: types.object.isRequired,
    $selectedLrp: types.object.isRequired
  },

  onMouseEnter() {
    var {desiredLrp, $selectedLrp} = this.props;
    $selectedLrp && $selectedLrp.set(desiredLrp);
  },

  onMouseLeave() {
    var {$selectedLrp} = this.props;
    $selectedLrp && $selectedLrp.set(undefined);
  }
};

module.exports = HoverLrpMixin;