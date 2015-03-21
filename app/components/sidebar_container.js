var classnames = require('classnames');
var React = require('react/addons');
var Tooltip = require('react-bootstrap/lib/Tooltip');
var ui = {Icon: require('../vendor/icon').Icon};
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
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
        {instancesError && <ui.Icon name="exclamation-circle"/>}
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