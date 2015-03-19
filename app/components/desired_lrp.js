var classnames = require('classnames');
var PureRenderMixin = require('../mixins/pure_render_mixin');
var HoverDesiredLrpMixin = require('../mixins/hover_desired_lrp_mixin');
var prettyBytes = require('pretty-bytes');
var PUI = {Media: require('../vendor/media').Media};
var React = require('react/addons');
var {pickColor} = require('../helpers/application_helper');
var {getRoutes, getHostname} = require('../helpers/lrp_helper');
var OverlayTrigger = require('react-bootstrap/lib/OverlayTrigger');
var Tooltip = require('react-bootstrap/lib/Tooltip');

var types = React.PropTypes;
var cx = React.addons.classSet;

function stopPropagation(e) {
  e.stopPropagation();
}

function links(array) {
  return array.map((hostname, i) => <a className="link-inverse type-ellipsis-1-line link-text" href={`//${hostname}`} key={i} title={hostname} target="_blank" onClick={stopPropagation}>{hostname}</a>);
}

var Routes = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    routes: types.array.isRequired
  },

  render() {
    var {routes} = this.props;

    if (routes.length === 1) {
      routes = (<div className="type-ellipsis-1-line">{links(routes[0].hostnames)}</div>);
    } else {
      routes = routes.map(function({port, hostnames}, i) {
        return (
          <tr key={i}>
            <td className="port prs"><span>{port}:</span></td>
            <td>{links(hostnames)}</td>
          </tr>);
      });
      routes = (<table className="txt-t"><tbody>{routes}</tbody></table>);
    }
    return (<div className="routes">{routes}</div>);
  }
});

var Container = React.createClass({
  propTypes: {
    desiredLrp: types.object.isRequired,
    tooltip: types.oneOfType([types.object, types.bool])
  },

  contextTypes: {
    colors: types.array.isRequired
  },

  render() {
    var {desiredLrp, tooltip} = this.props;
    var {process_guid: processGuid} = desiredLrp;
    var containerColor = pickColor(this.context.colors, getHostname(desiredLrp) || processGuid);
    var imageStyle = {backgroundColor: containerColor};

    if (!tooltip) {
      return (<a className={cx({'app-container-sidebar': true})} style={imageStyle} role="button"/>);
    }
    return (
      <OverlayTrigger placement="left" overlay={<Tooltip>{tooltip}</Tooltip>}>
        <a className={cx({'app-container-sidebar': true})} style={imageStyle} role="button"/>
      </OverlayTrigger>
    );
  }
});

var DesiredLrpInfo = React.createClass({
  render() {
    var {actualLrps, desiredLrp} = this.props;

    var routes = getRoutes(desiredLrp);
    var {disk_mb: disk, memory_mb: memory, process_guid: processGuid} = desiredLrp;
    disk = prettyBytes(disk * 1000000);
    memory = prettyBytes(memory * 1000000);
    var instancesRunning = actualLrps.filter(({state}) => state === 'RUNNING').length;
    var instances = `${instancesRunning}/${desiredLrp.instances}`;

    return (
      <section className="desired-lrp-info">
        <div className="process-guid type-ellipsis-1-line">{processGuid}</div>
        {routes && <Routes {...{routes}}/>}
        <div className="metadata">
          <span>{instances}</span>
          &nbsp;(M: {memory} D: {disk})
        </div>
      </section>
    );
  }
});

var DesiredLrp = React.createClass({
  mixins: [PureRenderMixin, HoverDesiredLrpMixin],

  propTypes: {
    desiredLrp: types.object.isRequired,
    actualLrps: types.array.isRequired,
    sidebarCollapsed: types.bool,
    $selection: types.object.isRequired
  },

  contextTypes: {
    colors: types.array.isRequired
  },

  ignorePureRenderProps: ['$selection'],

  render() {
    var {actualLrps, desiredLrp, className, sidebarCollapsed} = this.props;
    className = classnames(className, 'desired-lrp');

    var {process_guid: processGuid} = desiredLrp;
    var instancesRunning = actualLrps.filter(({state}) => state === 'RUNNING').length;
    var instancesError = instancesRunning < desiredLrp.instances;
    var desiredLrpInfo = (<DesiredLrpInfo {...{actualLrps, desiredLrp}}/>);
    return (
      <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} onClick={this.onClick} className={className}>
        <PUI.Media leftImage={<Container {...{desiredLrp, tooltip: sidebarCollapsed && desiredLrpInfo}}/>} key={processGuid} className={cx({'man': true, pal: !sidebarCollapsed, pam: sidebarCollapsed, 'error': instancesError})}>
          {desiredLrpInfo}
        </PUI.Media>
      </div>
    );
  }
});

module.exports = DesiredLrp;
