var FastMixin = require('../mixins/fast_mixin');
var {mergeClassNames} = require('../helpers/application_helper');
var prettyBytes = require('pretty-bytes');
var PUI = {Media: require('../vendor/media').Media};
var React = require('react/addons');

var types = React.PropTypes;
var cx = React.addons.classSet;

function links(array) {
  return array.map((hostname, i) => <a className="type-accent-4 type-ellipsis-1-line" href={`//${hostname}`} key={i} title={hostname} target="_blank">{hostname}</a>)
}

var Routes = React.createClass({
  mixins: [FastMixin],

  propTypes: {
    routes: types.array.isRequired
  },

  render() {
    var {routes} = this.props;

    if (routes.length === 1) {
      routes = (<div className="type-ellipsis-1-line">{links(routes[0].hostnames)}</div>);
    } else {
      routes = routes.map(function({port, hostnames}, i) {
        return (<tr key={i}><td className="port prs"><span>{port}:</span></td><td>{links(hostnames)}</td></tr>);
      });
      routes = (<table><tbody>{routes}</tbody></table>);
    }
    return (<div className="routes">{routes}</div>)
  }
});

var DesiredLrp = React.createClass({
  mixins: [FastMixin],

  propTypes: {
    desiredLrp: types.object.isRequired,
    actualLrps: types.array.isRequired,
    containerColor: types.string
  },

  render() {
    var {actualLrps, desiredLrp, containerColor, className} = this.props;
    var {disk_mb: disk, memory_mb: memory, process_guid: processGuid, routes: {'cf-router': routes}} = desiredLrp;
    var imageStyle = {backgroundColor: containerColor};
    var leftImage = (<a className="container-sidebar" style={imageStyle} role="button"/>);
    disk = prettyBytes(disk * 1000000);
    memory = prettyBytes(memory * 1000000);
    var instancesRunning = actualLrps.filter(({state}) => state === 'RUNNING').length;
    var instances = `${instancesRunning}/${desiredLrp.instances}`;
    className = mergeClassNames(className, cx({'desired-lrp': true, 'pam': true}));

    var instancesError = instancesRunning !== desiredLrp.instances;
    return (
      <PUI.Media leftImage={leftImage} key={processGuid} className={className}>
        <section>
          <div className="type-ellipsis-1-line">{processGuid}</div>
          <Routes {...{routes}}/>
          <div>
            <span className={cx({'type-error-3': instancesError, 'type-brand-5': !instancesError})}>{instances}</span>
            &nbsp;(M: {memory} D: {disk})
          </div>
        </section>
      </PUI.Media>
    );
  }
});

module.exports = DesiredLrp;
