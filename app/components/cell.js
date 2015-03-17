var PureRenderMixin = require('../mixins/pure_render_mixin');
var Container = require('./container');
var React = require('react/addons');
var {findLrp, filterDesiredLrps} = require('../helpers/lrp_helper');
var {mergeClassNames} = require('../helpers/react_helper');

var types = React.PropTypes;
var cx = React.addons.classSet;

function detectMatch($selection, status, match) {
  var target = $selection.get(status);
  return !!(target && findLrp([match], target));
}

function determineSelectedHover({$receptor, $selection, $sidebar, desiredLrp}) {
  if (!desiredLrp) return {};

  var {desiredLrps} = $receptor.get();
  var {hoverDesiredLrp, selectedDesiredLrp} = $selection.get();
  var {filter} = $sidebar.get();

  var isSelected = detectMatch($selection, 'selectedDesiredLrp', desiredLrp);
  if (selectedDesiredLrp) return {isSelected};
  var isHover = detectMatch($selection, 'hoverDesiredLrp', desiredLrp);
  if (hoverDesiredLrp) return {isHover};
  if (filter) {
    var filteredLrps = filterDesiredLrps(desiredLrps, filter);
    isSelected = !!(findLrp(filteredLrps, desiredLrp));
  }
  return {isSelected, isHover};
}

var Cell = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    actualLrps: types.array,
    cell: types.object.isRequired,
    scaling: types.string.isRequired,
    $receptor: types.object.isRequired,
    $selection: types.object.isRequired,
    $sidebar: types.object.isRequired
  },

  computeSelection(actualLrp) {
    var {$receptor, $selection} = this.props;
    var {desiredLrpsByProcessGuid} = $receptor.get();
    var desiredLrp = desiredLrpsByProcessGuid && desiredLrpsByProcessGuid[actualLrp.process_guid];
    var {isSelected, isHover} = determineSelectedHover({desiredLrp, ...this.props});

    var isHighlighted = detectMatch($selection, 'hoverActualLrp', actualLrp);

    return {desiredLrp, isHover, isSelected, isHighlighted};
  },

  render() {
    var {cell, actualLrps, scaling, style, $selection} = this.props;
    var denominator = scaling === 'containers' ? 50 : cell.capacity[scaling];
    var containers = actualLrps && actualLrps.map(function(actualLrp) {
        var {desiredLrp, isHighlighted, isHover, isSelected} = this.computeSelection(actualLrp);
        var containerClasses = cx({highlight: isHighlighted, hover: isHover, selected: isSelected});
        var props = {actualLrp, denominator, desiredLrp, scaling, $selection, className: containerClasses};
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