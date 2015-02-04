var React = require('react/addons');

var cx = React.addons.classSet;
var types = React.PropTypes;

var Cell = React.createClass({
  propTypes: {
    cell: types.object
  },

  contextTypes: {
    scaling: types.string.isRequired,
    desiredLrps: types.array
  },

  renderContainer: function(denominator, {instance_guid: key, process_guid: processGuid}) {
    var {desiredLrps, scaling} = this.context;

    var numerator = 1;
    var undesired;

    if (scaling !== 'containers') {
      var desiredLrp = desiredLrps && desiredLrps.find(desiredLrp => desiredLrp.process_guid === processGuid);
      if (desiredLrp) {
        numerator = desiredLrp[scaling];
      } else {
        numerator = 0;
        undesired = true;
      }
    }
    var style = {width: `${(numerator/denominator*100)}%`};
    var props = {title: processGuid, style, key};
    return (<div className={cx({container: true, flex: numerator === 0, undesired})} {...props}/>);
  },

  render() {
    var {cell, style} = this.props;
    var {actual_lrps: actualLrps} = cell;
    var {scaling} = this.context;

    var denominator = scaling === 'containers' ? 50 : cell.Capacity[scaling];
    var containers = actualLrps && actualLrps.map(this.renderContainer.bind(this, denominator));

    return (
      <li className="cell" style={style}>
        {containers}
      </li>
    );
  }
});

module.exports = Cell;