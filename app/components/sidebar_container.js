var classnames = require('classnames');
var Icon = require('pui-react-iconography').Icon;
var React = require('react/addons');
var OverlayTrigger = require('pui-react-overlay-trigger').OverlayTrigger;
var Tooltip = require('pui-react-tooltip').Tooltip;
var {getHostname} = require('../helpers/lrp_helper');
var {pickColor} = require('../helpers/application_helper');

var types = React.PropTypes;

var SidebarContainer = React.createClass({
  propTypes: {
    claimed: types.bool,
    desiredLrp: types.object.isRequired,
    instancesError: types.bool.isRequired,
    tooltip: types.oneOfType([types.object, types.bool])
  },

  contextTypes: {
    colors: types.array.isRequired
  },

  render() {
    var {desiredLrp, tooltip, instancesError, claimed} = this.props;
    var {process_guid: processGuid} = desiredLrp;
    var containerColor = pickColor(this.context.colors, getHostname(desiredLrp) || processGuid);
    var imageStyle = {backgroundColor: containerColor};

    var container = (
      <a className={classnames({'app-container-sidebar': true, claimed})} style={imageStyle} role="button">
        {instancesError && <Icon name="exclamation-circle"/>}
      </a>
    );

    if (!tooltip) {
      return container;
    }
    return (
      <OverlayTrigger placement="left" overlay={<Tooltip>{tooltip}</Tooltip>}>
        {container}
      </OverlayTrigger>
    );
  }
});

module.exports = SidebarContainer;