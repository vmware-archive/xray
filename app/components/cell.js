var React = require('react/addons');

var types = React.PropTypes;

var Cell = React.createClass({
  propTypes: {
    cell: types.object
  },

  contextTypes: {
    scaling: types.string.isRequired,
    desiredLrps: types.array
  },

  render() {
    var {cell, style} = this.props;
    var {actual_lrps: actualLrps} = cell;
    var {desiredLrps, scaling} = this.context;

    var denominator = scaling === 'containers' ? 50 : cell.Capacity[scaling];

    var containers = actualLrps && actualLrps.map(function({instance_guid: key, process_guid: processGuid}) {
        var desiredLrp = desiredLrps && desiredLrps.find(desiredLrp => desiredLrp.process_guid === processGuid);
        var numerator = (desiredLrp && desiredLrp[scaling]) || 1;
        var style = {width: `${(numerator/denominator*100)}%`};
        var props = {title: processGuid, style, key};
      return (<div className="container" {...props}/>);
    });

    return (
      <li className="cell" style={style}>
        {containers}
      </li>
    );
  }
});

module.exports = Cell;