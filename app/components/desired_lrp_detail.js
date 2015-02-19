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
    var {actualLrps = [], desiredLrps = [], selectedDesiredLrp} = $receptor.get();
    var desiredLrp = selectedDesiredLrp && findDesiredLrp(desiredLrps, selectedDesiredLrp);
    var isDeleted = false;
    if(!desiredLrp) {
      if(selectedDesiredLrp) {
        desiredLrp = selectedDesiredLrp;
        isDeleted = true;
      } else {
        return null;
      }
    }

    actualLrps = actualLrps.filter(({process_guid}) => process_guid === desiredLrp.process_guid);
    var props = {actualLrps, desiredLrp, $selectedDesiredLrp: $receptor.refine('selectedDesiredLrp')};
    return (
      <div className="desired-lrp-detail">
        <DesiredLrp {...props}/>
        {isDeleted && <span className="pam">This process has been deleted. Information in this panel is out of date.</span>}
        <ActualLrpList {...{actualLrps}}/>
      </div>
    );
  }
});

module.exports = DesiredLrpDetail;