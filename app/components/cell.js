var FastMixin = require('../mixins/fast_mixin');
var Container = require('./container');
var sortBy = require('lodash.sortby');
var React = require('react/addons');
var {findLrp, filterDesiredLrps} = require('../helpers/lrp_helper');
var {lpad} = require('../helpers/string_helper');
var {mergeClassNames} = require('../helpers/application_helper');

var types = React.PropTypes;
var cx = React.addons.classSet;

function detectMatch($receptor, status, match) {
  var target = $receptor.get(status);
  return !!(target && findLrp([match], target))
}

function determineSelectedHover($receptor, desiredLrp) {
  if (!desiredLrp) return {};

  var {desiredLrps, hoverDesiredLrp, selectedDesiredLrp, filter} = $receptor.get();
  var isSelected = detectMatch($receptor, 'selectedDesiredLrp', desiredLrp);
  if (selectedDesiredLrp) return {isSelected};
  var isHover = detectMatch($receptor, 'hoverDesiredLrp', desiredLrp);
  if (hoverDesiredLrp) return {isHover};
  if (filter) {
    var filteredLrps = filterDesiredLrps(desiredLrps, filter);
    isSelected = !!(findLrp(filteredLrps, desiredLrp));
  }
  return {isSelected, isHover};
}

var Cell = React.createClass({
  mixins: [FastMixin],

  propTypes: {
    actualLrps: types.array,
    cell: types.object.isRequired,
    $receptor: types.object.isRequired
  },

  contextTypes: {
    scaling: types.string.isRequired
  },

  computeSelection(actualLrp) {
    var {$receptor} = this.props;
    var {desiredLrps} = $receptor.get();
    //TODO: desiredLrps could be a hash for O(1) lookup instead of a find
    var desiredLrp = desiredLrps && desiredLrps.find(desiredLrp => desiredLrp.process_guid === actualLrp.process_guid);
    var {isSelected, isHover} = determineSelectedHover($receptor, desiredLrp);

    var isHighlighted = detectMatch($receptor, 'hoverActualLrp', actualLrp);

    return {desiredLrp, isHover, isSelected, isHighlighted};
  },

  render() {
    var {cell, $receptor} = this.props;
    var {actualLrps, style} = this.props;
    var {scaling} = this.context;
    var denominator = scaling === 'containers' ? 50 : cell.capacity[scaling];
    var containers = actualLrps && sortBy(actualLrps, lrp => lrp.process_guid + lpad(lrp.index, '0', 5)).map(function(actualLrp) {
        var {desiredLrp, isHighlighted, isHover, isSelected} = this.computeSelection(actualLrp);
        var containerClasses = cx({highlight: isHighlighted, hover: isHover, selected: isSelected});
        var props = {actualLrp, denominator, desiredLrp, $receptor, className: containerClasses};
        return (<Container {...props} key={actualLrp.modification_tag.epoch}/>);
      }, this);

    return (
      <li className={mergeClassNames('cell', this.props.className)} style={style}>
        {containers}
      </li>
    );
  }
});

module.exports = Cell;