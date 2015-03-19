var ActualLrpList = require('./actual_lrp_list');
var DesiredLrp = require('./desired_lrp');
var PureRenderMixin = require('../mixins/pure_render_mixin');
var React = require('react/addons');

var types = React.PropTypes;

var DesiredLrpDetail = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    $receptor: types.object.isRequired,
    $selection: types.object.isRequired
  },

  render() {
    var {$receptor, $selection} = this.props;
    var {actualLrps = [], desiredLrpsByProcessGuid = {}} = $receptor.get();
    var {selectedDesiredLrp} = $selection.get();
    var desiredLrp = selectedDesiredLrp && desiredLrpsByProcessGuid[selectedDesiredLrp.process_guid];
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
    var props = {actualLrps, desiredLrp, $selection, className: 'pas'};
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