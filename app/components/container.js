var FastMixin = require('../mixins/fast_mixin');
var {getHostname} = require('../helpers/lrp_helper');
var HoverDesiredLrpMixin = require('../mixins/hover_desired_lrp_mixin');
var {mergeClassNames, pickColor} = require('../helpers/application_helper');
var React = require('react/addons');

var types = React.PropTypes;
var cx = React.addons.classSet;

var Container = React.createClass({
  mixins: [FastMixin, HoverDesiredLrpMixin],

  propTypes: {
    actualLrp: types.object.isRequired,
    desiredLrp: types.object,
    denominator: types.number.isRequired,
    $receptor: types.object.isRequired
  },

  contextTypes: {
    colors: types.array.isRequired,
    scaling: types.string.isRequired,
    modal: types.object
  },

  ignoreFastProps: ['$receptor'],

  render() {
    var {state, instance_guid: instanceGuid, modification_tag: {epoch: key}, process_guid: processGuid} = this.props.actualLrp;
    var {denominator, desiredLrp, className} = this.props;
    var {scaling} = this.context;

    var flex;
    var undesired;
    var percentWidth = 1.0 / 50.0;
    var backgroundColor;

    if (!desiredLrp) {
      undesired = true;
      backgroundColor = null;
    } else {
      if (scaling !== 'containers') {
        var numerator = desiredLrp[scaling];
        percentWidth = numerator/denominator;
        flex = numerator === 0;
      }
      backgroundColor = pickColor(this.context.colors, getHostname(desiredLrp) || processGuid);
    }
    var style = {width: `${percentWidth*100}%`, backgroundColor: backgroundColor};
    className = mergeClassNames(className, cx({container: true, claimed: state === 'CLAIMED', flex, undesired}));
    var props = {className, role: 'button', title: processGuid, style, key, 'data-instance-guid': instanceGuid, onClick: this.onClick, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave};
    return (<a {...props}/>);
  }
});

module.exports = Container;