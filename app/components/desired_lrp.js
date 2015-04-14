var classnames = require('classnames');
var HoverDesiredLrpMixin = require('../mixins/hover_desired_lrp_mixin');
var Media = require('pui-react-media').Media;
var prettyBytes = require('pretty-bytes');
var PureRenderMixin = require('../mixins/pure_render_mixin');
var React = require('react/addons');
var SidebarContainer = require('./sidebar_container');
var {getRoutes} = require('../helpers/lrp_helper');

var types = React.PropTypes;

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
    tag: types.string,
    $selection: types.object.isRequired,
    $sidebar: types.object.isRequired
  },

  getDefaultProps() {
    return {tag: 'div'};
  },

  contextTypes: {
    colors: types.array.isRequired
  },

  ignorePureRenderProps: ['$selection'],

  render() {
    var {actualLrps, desiredLrp, className, sidebarCollapsed, tag: Tag} = this.props;

    var {process_guid: processGuid} = desiredLrp;
    var claimed = actualLrps.some(({state}) => state === 'CLAIMED');
    var instancesRunning = actualLrps.filter(({state}) => state === 'RUNNING').length;
    var instancesError = instancesRunning < desiredLrp.instances;
    var desiredLrpInfo = (<DesiredLrpInfo {...{actualLrps, desiredLrp}}/>);
    className = classnames(className, 'desired-lrp', {error: instancesError});
    return (
      <Tag onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} onClick={this.onClick} className={className}>
        <Media leftImage={<SidebarContainer {...{instancesError, desiredLrp, claimed, tooltip: sidebarCollapsed && desiredLrpInfo}}/>} key={processGuid} className="man">
          {desiredLrpInfo}
        </Media>
      </Tag>
    );
  }
});

module.exports = DesiredLrp;
