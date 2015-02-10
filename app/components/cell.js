var React = require('react/addons');
var FastMixin = require('../mixins/fast_mixin');

var cx = React.addons.classSet;
var types = React.PropTypes;
var {lpad} = require('../helpers/string_helper');
var sortBy = require('lodash.sortby');
var {pickColor} = require('../helpers/application_helper');

var Container = React.createClass({
  mixins: [FastMixin],

  propTypes: {
    actualLrp: types.object.isRequired,
    desiredLrp: types.object,
    denominator: types.number.isRequired
  },

  contextTypes: {
    colors: types.array.isRequired,
    scaling: types.string.isRequired
  },

  render: function() {
    var {instance_guid: key, process_guid: processGuid} = this.props.actualLrp;
    var {denominator, desiredLrp} = this.props;
    var {scaling} = this.context;

    var flex;
    var undesired;
    var percentWidth = 1.0 / 50.0;
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
  }
});

var Cell = React.createClass({
  mixins: [FastMixin],

  propTypes: {
    actualLrps: types.array,
    cell: types.object,
    desiredLrps: types.array
  },

  contextTypes: {
    scaling: types.string.isRequired
  },

  render() {
    var {actualLrps, cell, desiredLrps, style} = this.props;
    var {scaling} = this.context;
    var denominator = scaling === 'containers' ? 50 : cell.capacity[scaling];
    var containers = actualLrps && sortBy(actualLrps, lrp => lrp.process_guid + lpad(lrp.index, '0', 5)).map(function(actualLrp) {
        //TODO: desiredLrps could be a hash for O(1) lookup instead of a find
        var desiredLrp = desiredLrps && desiredLrps.find(desiredLrp => desiredLrp.process_guid === actualLrp.process_guid);
        return (<Container {...{actualLrp, denominator, desiredLrp}} key={actualLrp.instance_guid}/>);
      });

    return (
      <li className="cell" style={style}>
        {containers}
      </li>
    );
  }
});

module.exports = Cell;