var React = require('react/addons');

var cx = React.addons.classSet;
var types = React.PropTypes;
var {lpad} = require('../helpers/string_helper');
var sortBy = require('lodash.sortby');
var {pickColor} = require('../helpers/application_helper');

var Cell = React.createClass({
  mixins: [require('../mixins/fast_mixin')],

  propTypes: {
    cell: types.object
  },

  contextTypes: {
    colors: types.array.isRequired,
    scaling: types.string.isRequired,
    desiredLrps: types.array
  },

  renderContainer: function(denominator, {instance_guid: key, process_guid: processGuid}) {
    var {desiredLrps, scaling} = this.context;

    var flex;
    var undesired;
    var percentWidth = 1.0 / 50.0;
    var desiredLrp = desiredLrps && desiredLrps.find(desiredLrp => desiredLrp.process_guid === processGuid);
    var backgroundColor = pickColor(this.context.colors, processGuid);

    if (!desiredLrp) {
      undesired = true;
      backgroundColor = null;
    } else {
      if (scaling !== 'containers') {
        var numerator = desiredLrp[scaling];
        percentWidth = numerator/denominator;
        flex = numerator === 0;
      }
    }

    var style = {width: `${percentWidth*100}%`, backgroundColor: backgroundColor};
    var props = {title: processGuid, style, key};
    return (<div className={cx({container: true, flex, undesired})} data-instance-guid={key} {...props} />);
  },

  render() {
    var {cell, style} = this.props;
    var {actual_lrps: actualLrps} = cell;
    var {scaling} = this.context;
    var denominator = scaling === 'containers' ? 50 : cell.capacity[scaling];
    var containers = actualLrps && sortBy(actualLrps, lrp => lrp.process_guid + lpad(lrp.index, '0', 5)).map(this.renderContainer.bind(this, denominator));

    return (
      <li className="cell" style={style}>
        {containers}
      </li>
    );
  }
});

module.exports = Cell;