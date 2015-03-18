var PureRenderMixin = require('../mixins/pure_render_mixin');
var Container = require('./container');
var React = require('react/addons');
var {mergeClassNames} = require('../helpers/react_helper');

var types = React.PropTypes;

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

  getDesiredLrp(actualLrp) {
    var {$receptor} = this.props;
    var {desiredLrpsByProcessGuid} = $receptor.get();
    return desiredLrpsByProcessGuid && desiredLrpsByProcessGuid[actualLrp.process_guid];
  },

  render() {
    var {cell, actualLrps, scaling, style, $selection} = this.props;
    var denominator = scaling === 'containers' ? 50 : cell.capacity[scaling];
    var containers = actualLrps && actualLrps.map(function(actualLrp) {
      var desiredLrp = this.getDesiredLrp(actualLrp);
      var props = {actualLrp, denominator, desiredLrp, scaling, $selection};
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