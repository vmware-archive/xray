var React = require('react/addons');
var prettyBytes = require('pretty-bytes');
var PureRenderMixin = require('../mixins/pure_render_mixin');
var types = React.PropTypes;
var {getRoutes} = require('../helpers/lrp_helper');

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
        <p className="process-guid type-ellipsis-1-line mvn">{processGuid}</p>
        {routes && <Routes {...{routes}}/>}
        <p className="metadata mvn">
          <span>{instances}</span>
          &nbsp;(M: {memory} D: {disk})
        </p>
      </section>
    );
  }
});

module.exports = DesiredLrpInfo;
