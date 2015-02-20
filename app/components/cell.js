var FastMixin = require('../mixins/fast_mixin');
var Container = require('./container');
var sortBy = require('lodash.sortby');
var React = require('react/addons');
var {findLrp} = require('../helpers/lrp_helper');
var {lpad} = require('../helpers/string_helper');
var {mergeClassNames} = require('../helpers/application_helper');

var types = React.PropTypes;
var cx = React.addons.classSet;

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

  render() {
    var {cell, $receptor} = this.props;
    var desiredLrps = $receptor.get('desiredLrps');
    var {actualLrps, style} = this.props;
    var {scaling} = this.context;
    var denominator = scaling === 'containers' ? 50 : cell.capacity[scaling];
    var containers = actualLrps && sortBy(actualLrps, lrp => lrp.process_guid + lpad(lrp.index, '0', 5)).map(function(actualLrp) {
        //TODO: desiredLrps could be a hash for O(1) lookup instead of a find
        var desiredLrp = desiredLrps && desiredLrps.find(desiredLrp => desiredLrp.process_guid === actualLrp.process_guid);
        var isHover = false;
        var isSelected = false;
        var $hoverDesiredLrp = $receptor.refine('hoverDesiredLrp');
        var $selectedDesiredLrp = $receptor.refine('selectedDesiredLrp');
        if(desiredLrp) {
          isHover = !!($hoverDesiredLrp.get() && findLrp([desiredLrp], $hoverDesiredLrp.get()));
          isSelected = !!($selectedDesiredLrp.get() && findLrp([desiredLrp], $selectedDesiredLrp.get()));
        }
        var isHighlighted = !!($receptor.get('hoverActualLrp') && findLrp([actualLrp], $receptor.get('hoverActualLrp')));
        var containerClasses = cx({ highlight: isHighlighted, hover: isHover && !isSelected, selected: isSelected});

        return (<Container {...{actualLrp, denominator, desiredLrp, $hoverDesiredLrp, $selectedDesiredLrp, className: containerClasses}} key={actualLrp.modification_tag.epoch}/>);
      });

    return (
      <li className={mergeClassNames('cell', this.props.className)} style={style}>
        {containers}
      </li>
    );
  }
});

module.exports = Cell;