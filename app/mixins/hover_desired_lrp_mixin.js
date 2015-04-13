var React = require('react/addons');
var types = React.PropTypes;
var throttle = require('lodash.throttle');

var privates = new WeakMap();

function withFilter(callback) {
  return function(...args) {
    var {desiredLrp, $selection, $sidebar} = this.props;
    if (!$sidebar.get('filter') || desiredLrp.process_guid in $selection.get('filteredLrps')) callback.apply(this, args);
  };
}


var HoverDesiredLrpMixin = {
  propTypes: {
    desiredLrp: types.object.isRequired,
    $selection: types.object.isRequired,
    $sidebar: types.object.isRequired
  },

  componentDidMount() {
    var addHover = throttle(function updateHover($selection, desiredLrp) {
      $selection.merge({hoverDesiredLrp: desiredLrp});
    }, 16);

    var removeHover = throttle(function updateHover($selection) {
      $selection.merge({hoverDesiredLrp: null});
    }, 16);

    privates.set(this, {addHover, removeHover});
  },

  onMouseEnter: withFilter(function() {
    var {addHover} = privates.get(this);
    var {desiredLrp, $selection} = this.props;
    addHover($selection, desiredLrp);
  }),

  onMouseLeave: withFilter(function() {
    var {removeHover} = privates.get(this);
    var {$selection} = this.props;
    removeHover($selection);
  }),

  onClick: withFilter(function(e) {
    e.stopPropagation();
    var {desiredLrp, $selection, $sidebar} = this.props;
    $selection.merge({selectedDesiredLrp: desiredLrp});
    $sidebar.merge({sidebarCollapsed: false});
  })
};

module.exports = HoverDesiredLrpMixin;