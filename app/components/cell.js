var PureRenderMixin = require('pui-cursor/mixins/pure-render-mixin');
var Container = require('./container');
var React = require('react');
var classnames = require('classnames');

var types = React.PropTypes;

var Cell = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    actualLrps: types.array,
    cell: types.object.isRequired,
    className: types.string,
    scaling: types.string.isRequired,
    $receptor: types.object.isRequired,
    $selection: types.object.isRequired,
    $sidebar: types.object.isRequired
  },

  getDesiredLrp(actualLrp) {
    var {$receptor} = this.props;
    var {desiredLrpsByProcessGuid} = $receptor.get();
    return desiredLrpsByProcessGuid && desiredLrpsByProcessGuid[actualLrp.process_guid];
  },

  getSelectionClasses({actualLrp, desiredLrp}) {
    var {$selection} = this.props;
    var {selectedDesiredLrp, hoverDesiredLrp, hoverActualLrp, filteredLrps} = $selection.get();
    var isFiltered = !selectedDesiredLrp && !hoverDesiredLrp && filteredLrps && !!filteredLrps[actualLrp.process_guid];
    return {
      selected: isFiltered || selectedDesiredLrp === desiredLrp,
      hover: hoverDesiredLrp === desiredLrp,
      highlight: hoverActualLrp === actualLrp
    };
  },

  render() {
    var {cell, actualLrps, scaling, style, $selection, $sidebar} = this.props;
    var denominator = scaling === 'containers' ? 50 : cell.capacity[scaling];
    var containers = actualLrps && actualLrps.map(function(actualLrp) {
      var desiredLrp = this.getDesiredLrp(actualLrp);
      var className = classnames(this.getSelectionClasses({actualLrp, desiredLrp}));
      var props = {actualLrp, denominator, desiredLrp, scaling, $selection, $sidebar, className};
      return (<Container {...props} key={actualLrp.modification_tag.epoch}/>);
    }, this);

    return (
      <li className={classnames('cell', this.props.className)} style={style}>
        {containers}
      </li>
    );
  }
});

module.exports = Cell;