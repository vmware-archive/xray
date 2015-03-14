var DesiredLrp = require('./desired_lrp');
var React = require('react/addons');
var SidebarHeader = require('./sidebar_header');
var {filterDesiredLrps} = require('../helpers/lrp_helper');

var types = React.PropTypes;

var DesiredLrpList = React.createClass({
  propTypes: {
    $receptor: types.object.isRequired,
    $selection: types.object.isRequired,
    $sidebar: types.object.isRequired
  },

  renderDesiredLrps(desiredLrps) {
    var {$receptor, $selection} = this.props;
    var {actualLrps} = $receptor.get();
    actualLrps = actualLrps || [];

    if(!desiredLrps.length) {
      return <div className="mam">No filtered processes found.</div>;
    }

    var {hoverDesiredLrp} = $selection.get();
    return desiredLrps.map(function(desiredLrp) {
      var key = desiredLrp.process_guid;
      var className = 'clickable';
      var filtered = actualLrps.filter(({process_guid}) => process_guid === desiredLrp.process_guid);
      var isSelected = !!(desiredLrp && hoverDesiredLrp === desiredLrp);
      var props = {className, desiredLrp, actualLrps: filtered, key, $selection, isSelected};
      return <DesiredLrp {...props}/>;
    }, this);
  },

  render() {
    var {$receptor, $sidebar} = this.props;
    var {desiredLrps} = $receptor.get();
    var {filter} = $sidebar.get();
    desiredLrps = desiredLrps || [];
    if (filter) {
      desiredLrps = filterDesiredLrps(desiredLrps, filter);
    }

    return (
      <div className="desired-lrp-list">
        <SidebarHeader {...{$sidebar}}/>
        <section className="desired-lrps">
          {this.renderDesiredLrps(desiredLrps)}
        </section>
      </div>
    );
  }
});

module.exports = DesiredLrpList;