var PureRenderMixin = require('../mixins/pure_render_mixin');
var {getHostname} = require('../helpers/lrp_helper');
var HoverDesiredLrpMixin = require('../mixins/hover_desired_lrp_mixin');
var {pickColor} = require('../helpers/application_helper');
var {mergeClassNames} = require('../helpers/react_helper');
var React = require('react/addons');

var types = React.PropTypes;
var cx = React.addons.classSet;

var Container = React.createClass({
  mixins: [PureRenderMixin, HoverDesiredLrpMixin],

  propTypes: {
    actualLrp: types.object.isRequired,
    desiredLrp: types.object,
    denominator: types.number.isRequired,
    scaling: types.string.isRequired,
    $selection: types.object.isRequired
  },

  contextTypes: {
    colors: types.array.isRequired,
    modal: types.object
  },

  ignorePureRenderProps: ['$selection'],

  render() {
    var {state, instance_guid: instanceGuid, modification_tag: {epoch: key}, process_guid: processGuid} = this.props.actualLrp;
    var {denominator, desiredLrp, className, scaling} = this.props;

    var flex;
    var undesired;
    var backgroundColor;
    var processNumber;
    var width;

    if (!desiredLrp) {
      undesired = true;
      backgroundColor = null;
      processNumber = -1;
    } else {
      if (scaling !== 'containers') {
        var numerator = desiredLrp[scaling];
        var percentWidth = numerator / denominator;
        width = `${percentWidth * 100}%`;
        flex = numerator === 0;
      }
      backgroundColor = pickColor(this.context.colors, getHostname(desiredLrp) || processGuid);
      processNumber = desiredLrp.processNumber;
    }

    var style = {width, backgroundColor};
    className = mergeClassNames(
      className,
      cx({
        'app-container': true,
        claimed: state === 'CLAIMED',
        flex,
        undesired
      }),
      `app-${processNumber}`);
    var props = {className, role: 'button', title: processGuid, style, key, 'data-instance-guid': instanceGuid, onClick: this.onClick, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave};
    return (<a {...props}/>);
  }
});

module.exports = Container;