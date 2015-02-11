var FastMixin = require('../mixins/fast_mixin');
var Container = require('./container');
var React = require('react/addons');

var types = React.PropTypes;
var {lpad} = require('../helpers/string_helper');
var sortBy = require('lodash.sortby');

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
        return (<Container {...{actualLrp, denominator, desiredLrp, $receptor}} key={actualLrp.instance_guid}/>);
      });

    return (
      <li className="cell" style={style}>
        {containers}
      </li>
    );
  }
});

module.exports = Cell;