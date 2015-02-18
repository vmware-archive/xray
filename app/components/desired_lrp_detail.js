var ActualLrpList = require('./actual_lrp_list');
var DesiredLrp = require('./desired_lrp');
var React = require('react/addons');
var {findDesiredLrp} = require('../helpers/desired_lrp_helper');

var types = React.PropTypes;

var DesiredLrpDetail = React.createClass({
  propTypes: {
    $receptor: types.object.isRequired
  },

  render() {
    var {$receptor} = this.props;
    var {actualLrps = [], desiredLrps = [], selectedLrp} = $receptor.get();
    var desiredLrp = selectedLrp && findDesiredLrp(desiredLrps, selectedLrp);
    if (!desiredLrp) return null;

    actualLrps = actualLrps.filter(({process_guid}) => process_guid === desiredLrp.process_guid);
    var props = {actualLrps, desiredLrp, $selectedLrp: $receptor.refine('selectedLrp')};
    return (
      <div className="desired-lrp-detail">
        <DesiredLrp {...props}/>
        <ActualLrpList {...{actualLrps}}/>
      </div>
    );
  }
});

module.exports = DesiredLrpDetail;