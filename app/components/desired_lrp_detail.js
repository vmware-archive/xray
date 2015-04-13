var ActualLrpList = require('./actual_lrp_list');
var DesiredLrp = require('./desired_lrp');
var PureRenderMixin = require('../mixins/pure_render_mixin');
var React = require('react/addons');

var types = React.PropTypes;

var DesiredLrpDetail = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    $receptor: types.object.isRequired,
    $selection: types.object.isRequired,
    $sidebar: types.object.isRequired
  },

  render() {
    var {$receptor, $selection, $sidebar} = this.props;
    var {actualLrpsByProcessGuid = {}, desiredLrpsByProcessGuid = {}} = $receptor.get();
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

    var actualLrps = actualLrpsByProcessGuid[desiredLrp.process_guid] || [];
    var $hoverActualLrp = $selection.refine('hoverActualLrp');
    var $hoverSidebarActualLrp = $sidebar.refine('hoverActualLrp');
    return (
      <div className="desired-lrp-detail">
        <DesiredLrp {...{actualLrps, desiredLrp, $selection, $sidebar}}/>
        {isDeleted && <span className="pal">This process has been deleted. Information in this panel is out of date.</span>}
        <ActualLrpList {...{actualLrps, $hoverActualLrp, $hoverSidebarActualLrp}}/>
      </div>
    );
  }
});

module.exports = DesiredLrpDetail;