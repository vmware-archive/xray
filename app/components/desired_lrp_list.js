var React = require('react/addons');
var DesiredLrp = require('./desired_lrp');
var {filterDesiredLrps} = require('../helpers/lrp_helper');

var cx = React.addons.classSet;
var types = React.PropTypes;

var DesiredLrpList = React.createClass({
  propTypes: {
    $receptor: types.object.isRequired
  },

  renderDesiredLrps(desiredLrps) {
    var {$receptor} = this.props;
    var {actualLrps = []} = $receptor.get();

    if(!desiredLrps.length) {
      return <div className="mam">No filtered processes found.</div>;
    }

    var {sidebarCollapsed, hoverDesiredLrp} = $receptor.get();
    return desiredLrps.map(function(desiredLrp, i) {
      var key = desiredLrp.process_guid;
      var odd = sidebarCollapsed ? false : i % 2;
      var className = cx({'clickable': true, 'bg-dark-1': odd, 'bg-dark-2': !odd});
      var filtered = actualLrps.filter(({process_guid}) => process_guid === desiredLrp.process_guid);
      var isSelected = !!(desiredLrp && hoverDesiredLrp === desiredLrp);
      var props = {className, desiredLrp, actualLrps: filtered, key, $receptor, isSelected};
      return <DesiredLrp {...props}/>;
    }, this);
  },

  render() {
    var {$receptor} = this.props;
    var {filter, desiredLrps = []} = $receptor.get();
    if (filter) {
      desiredLrps = filterDesiredLrps(desiredLrps, filter);
    }

    return (
      <div className="desired-lrp-list">
        <section className="desired-lrps">
          {this.renderDesiredLrps(desiredLrps)}
        </section>
      </div>
    );
  }
});

module.exports = DesiredLrpList;