var PureRenderMixin = require('../mixins/pure_render_mixin');
var {getHostname} = require('../helpers/lrp_helper');
var HoverDesiredLrpMixin = require('../mixins/hover_desired_lrp_mixin');
var {pickColor} = require('../helpers/application_helper');
var classnames = require('classnames');
var React = require('react/addons');
var {OverlayTrigger} = require('pui-react-overlay-trigger');
var {Tooltip} = require('pui-react-tooltip');
var DesiredLrpInfo = require('./desired_lrp_info');

var types = React.PropTypes;

var Container = React.createClass({
  mixins: [PureRenderMixin, HoverDesiredLrpMixin],

  propTypes: {
    actualLrp: types.object.isRequired,
    desiredLrp: types.object,
    denominator: types.number.isRequired,
    scaling: types.string.isRequired,
    $selection: types.object.isRequired,
    $sidebar: types.object.isRequired
  },

  contextTypes: {
    colors: types.array.isRequired
  },

  ignorePureRenderProps: ['$selection', '$sidebar'],

  render() {
    var {denominator, desiredLrp, className, scaling, actualLrp} = this.props;
    var {state, instance_guid: instanceGuid, modification_tag: {epoch: key}, process_guid: processGuid} = actualLrp;

    var flex;
    var undesired;
    var backgroundColor;
    var width;

    if (!desiredLrp) {
      undesired = true;
      backgroundColor = null;
    } else {
      if (scaling !== 'containers') {
        var numerator = desiredLrp[scaling];
        var percentWidth = numerator / denominator;
        width = `${percentWidth * 100}%`;
        flex = numerator === 0;
      }
      backgroundColor = pickColor(this.context.colors, getHostname(desiredLrp) || processGuid);
    }

    var style = {width, backgroundColor};
    className = classnames(
      className,
      {
        'app-container': true,
        claimed: state === 'CLAIMED',
        flex,
        undesired
      });
    var props = {className, role: 'button', style, key, 'data-instance-guid': instanceGuid, onClick: this.onClick, onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave};
    return (
      <OverlayTrigger placement="right" overlay={<Tooltip><DesiredLrpInfo {...{actualLrps: [actualLrp], desiredLrp}}/></Tooltip>}>
        <a {...props}><span className="sr-only">{processGuid}</span></a>
      </OverlayTrigger>
    );
  }
});

module.exports = Container;