var React = require('react/addons');
var DesiredLrp = require('./desired_lrp');
var SidebarHeader = require('./sidebar_header');
var cx = React.addons.classSet;

var types = React.PropTypes;

function matchesRoutes(desiredLrp, filter) {
  if (!desiredLrp.routes) return false;
  var routerKey = Object.keys(desiredLrp.routes)[0];
  var routes = desiredLrp.routes[routerKey];
  return routes.some(route => route.hostnames.some(hostname => hostname.includes(filter)));
}

var DesiredLrpList = React.createClass({
  propTypes: {
    $receptor: types.object.isRequired
  },

  renderDesiredLrps(desiredLrps) {
    var {$receptor} = this.props;
    var {actualLrps = []} = $receptor.get();
    var $hoverDesiredLrp = $receptor.refine('hoverDesiredLrp');
    var $selectedDesiredLrp = $receptor.refine('selectedDesiredLrp');

    if(!desiredLrps.length) {
      return <div className="mam">No filtered processes found.</div>;
    }

    return desiredLrps.map(function(desiredLrp, i) {
      var key = desiredLrp.process_guid;
      var odd = i % 2;
      var className = cx({'clickable': true, 'bg-dark-1': odd, 'bg-dark-2': !odd});
      var filtered = actualLrps.filter(({process_guid}) => process_guid === desiredLrp.process_guid);
      var isSelected = !!(desiredLrp && $hoverDesiredLrp.get() === desiredLrp);
      var props = {className, desiredLrp, actualLrps: filtered, key, $hoverDesiredLrp, $selectedDesiredLrp, isSelected};
      return <DesiredLrp {...props}/>;
    }, this);
  },

  render() {
    var {$receptor} = this.props;
    var {filter} = $receptor.get();
    var {desiredLrps = []} = $receptor.get();
    if (filter) {
      desiredLrps = desiredLrps.filter(desiredLrp  => desiredLrp.process_guid.includes(filter) || matchesRoutes(desiredLrp, filter))
    }

    return (
      <div className="desired-lrp-list">
        <SidebarHeader $filter={$receptor.refine('filter')}/>
        <section className="desired-lrps">
          {this.renderDesiredLrps(desiredLrps)}
        </section>
      </div>
    );
  }
});

module.exports = DesiredLrpList;