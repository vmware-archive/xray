var FastMixin = require('../mixins/fast_mixin');
var HoverLrpMixin = require('../mixins/hover_lrp_mixin');
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
  mixins: [FastMixin, HoverLrpMixin],

  propTypes: {
    desiredLrp: types.object.isRequired,
    actualLrps: types.array.isRequired,
    containerColor: types.string,
    isSelected: types.bool.isRequired,
    $selectedLrp: types.object.isRequired
  },

  ignoreFastProps: ['$selectedLrp'],

  render() {
    var {actualLrps, desiredLrp, containerColor, className, isSelected} = this.props;
    var routes;
    if (desiredLrp.routes) {
      var routerKey = Object.keys(desiredLrp.routes)[0];
      if (routerKey) {
        routes = desiredLrp.routes[routerKey];
      }
    }
    var {disk_mb: disk, memory_mb: memory, process_guid: processGuid} = desiredLrp;
    var imageStyle = {backgroundColor: containerColor};
    var leftImage = (<a className={cx({'container-sidebar': true, selected: isSelected})} style={imageStyle} role="button"/>);
    disk = prettyBytes(disk * 1000000);
    memory = prettyBytes(memory * 1000000);
    var instancesRunning = actualLrps.filter(({state}) => state === 'RUNNING').length;
    var instancesError = instancesRunning !== desiredLrp.instances;
    var instances = `${instancesRunning}/${desiredLrp.instances}`;
    return (
      <div onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} className={className}>
        <PUI.Media leftImage={leftImage} key={processGuid} className={cx({'desired-lrp pam': true, 'bg-accent-2': isSelected})}>
          <section>
            <div className="process-guid type-ellipsis-1-line">{processGuid}</div>
            {routes && <Routes {...{routes}}/>}
            <div>
              <span className={cx({'type-error-3': instancesError, 'type-brand-5': !instancesError})}>{instances}</span>
              &nbsp;(M: {memory} D: {disk})
            </div>
          </section>
        </PUI.Media>
      </div>
    );
  }
});

module.exports = DesiredLrp;
