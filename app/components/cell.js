var React = require('react/addons');

var types = React.PropTypes;

var Cell = React.createClass({
  propTypes: {
    cell: types.object
  },

  render() {
    var {cell} = this.props;
    var {actual_lrps: actualLrps} = cell;
    actualLrps = actualLrps && actualLrps.map(function({instance_guid: instanceGuid, process_guid: processGuid}) {
      return (<div className="actual-lrp" title={processGuid} key={instanceGuid}/>);
    });

    return (
      <li className="cell">
        {actualLrps}
      </li>
    );
  }
});

module.exports = Cell;