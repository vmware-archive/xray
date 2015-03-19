var React = require('react/addons');
var types = React.PropTypes;
var throttle = require('lodash.throttle');

var addHover = throttle(function updateHover($selection, desiredLrp) {
  $selection.merge({hoverDesiredLrp: desiredLrp});
}, 16);

var removeHover = throttle(function updateHover($selection) {
  $selection.merge({hoverDesiredLrp: null});
}, 16);

var HoverDesiredLrpMixin = {
  propTypes: {
    desiredLrp: types.object.isRequired,
    $selection: types.object.isRequired
  },

  onMouseEnter() {
    var {desiredLrp, $selection} = this.props;
    addHover($selection, desiredLrp);
  },

  onMouseLeave() {
    var {$selection} = this.props;
    removeHover($selection);
  },

  onClick(e) {
    e.stopPropagation();
    var {desiredLrp, $selection} = this.props;
    $selection.merge({selectedDesiredLrp: desiredLrp, sidebarCollapsed: false});
  }
};

module.exports = HoverDesiredLrpMixin;