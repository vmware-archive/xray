var DesiredLrp = require('./desired_lrp');
var PureRenderMixin = require('../mixins/pure_render_mixin');
var React = require('react/addons');
var SidebarHeader = require('./sidebar_header');
var classnames = require('classnames');

var types = React.PropTypes;

var DesiredLrpList = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    $receptor: types.object.isRequired,
    $selection: types.object.isRequired,
    $sidebar: types.object.isRequired
  },

  renderDesiredLrps(desiredLrps) {
    var {$receptor, $selection, $sidebar} = this.props;
    var {actualLrpsByProcessGuid = {}} = $receptor.get();
    var sidebarCollapsed = $sidebar.get('sidebarCollapsed');

    if(!desiredLrps.length && !sidebarCollapsed) {
      return <div className="mam">No filtered processes found.</div>;
    }

    desiredLrps = desiredLrps.map(this.renderDesiredLrp.bind(this, {actualLrpsByProcessGuid, sidebarCollapsed, $selection, $sidebar}));
    return (
      <ul className="list-group-inverse pln">
        {desiredLrps}
      </ul>
    );
  },

  renderDesiredLrp({actualLrpsByProcessGuid, sidebarCollapsed, $selection, $sidebar}, desiredLrp) {
    var key = desiredLrp.process_guid;
    var className = classnames('clickable', {hover: $sidebar.get('filter') || $selection.get('hoverDesiredLrp') === desiredLrp});
    var filtered = actualLrpsByProcessGuid[desiredLrp.process_guid] || [];
    return (
      <DesiredLrp {...{className, desiredLrp, actualLrps: filtered, sidebarCollapsed, $selection, $sidebar, key, tag: 'li'}}/>
    );
  },

  render() {
    var {$receptor, $selection, $sidebar} = this.props;
    var {desiredLrps = []} = $receptor.get();
    var {filter} = $sidebar.get();
    if (filter) {
      var {filteredLrps} = $selection.get();
      desiredLrps = desiredLrps.filter(({process_guid: processGuid}) => processGuid in filteredLrps);
    }
    return (
      <div className="desired-lrp-list">
        <SidebarHeader {...{$receptor, $selection, $sidebar}}/>
        <section className="desired-lrps">
          {this.renderDesiredLrps(desiredLrps)}
        </section>
      </div>
    );
  }
});

module.exports = DesiredLrpList;