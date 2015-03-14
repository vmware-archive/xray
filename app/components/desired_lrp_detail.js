var ActualLrpList = require('./actual_lrp_list');
var DesiredLrp = require('./desired_lrp');
var React = require('react/addons');
var {findLrp} = require('../helpers/lrp_helper');

var types = React.PropTypes;

var DesiredLrpDetail = React.createClass({
  propTypes: {
    $receptor: types.object.isRequired,
    $selection: types.object.isRequired
  },

  render() {
    var {$receptor, $selection} = this.props;
    var {actualLrps, desiredLrps} = $receptor.get();
    var {selectedDesiredLrp} = $selection.get();
    actualLrps = actualLrps || [];
    desiredLrps = desiredLrps || [];
    var desiredLrp = selectedDesiredLrp && findLrp(desiredLrps, selectedDesiredLrp);
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
    var props = {actualLrps, desiredLrp, $selection};
    return (
      <div className="desired-lrp-detail">
        <DesiredLrp {...props}/>
        {isDeleted && <span className="pam">This process has been deleted. Information in this panel is out of date.</span>}
        <ActualLrpList {...{actualLrps, $hoverActualLrp: $selection.refine('hoverActualLrp')}}/>
      </div>
    );
  }
});

module.exports = DesiredLrpDetail;