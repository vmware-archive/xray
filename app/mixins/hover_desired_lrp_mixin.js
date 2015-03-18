var React = require('react/addons');
var types = React.PropTypes;
var throttle = require('lodash.throttle');

var updateHover = throttle(function updateHover($selection, desiredLrp) {
  $selection.merge({hoverDesiredLrp: desiredLrp});
}, 200);

var HoverDesiredLrpMixin = {
  propTypes: {
    desiredLrp: types.object.isRequired,
    $selection: types.object.isRequired
  },

  onMouseEnter() {
    var {desiredLrp, $selection} = this.props;
    updateHover($selection, desiredLrp);
  },

  onMouseLeave() {
    var {$selection} = this.props;
    updateHover($selection, null);
  },

  onClick(e) {
    e.stopPropagation();
    var {desiredLrp, $selection} = this.props;
    $selection.merge({selectedDesiredLrp: desiredLrp, sidebarCollapsed: false});
  }
};

module.exports = HoverDesiredLrpMixin;