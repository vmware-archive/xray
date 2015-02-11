var FastMixin = require('../mixins/fast_mixin');
var ActualLrpModal = require('./actual_lrp_modal');
var React = require('react/addons');
var {pickColor} = require('../helpers/application_helper');

var types = React.PropTypes;
var cx = React.addons.classSet;

var Container = React.createClass({
  mixins: [FastMixin],

  propTypes: {
    actualLrp: types.object.isRequired,
    desiredLrp: types.object,
    denominator: types.number.isRequired,
    selected: types.bool.isRequired,
    $selectedLrp: types.object
  },

  ignoreFastProps: ['$selectedLrp'],

  contextTypes: {
    colors: types.array.isRequired,
    scaling: types.string.isRequired,
    modal: types.object
  },

  click() {
    var {modal} = this.context;
    if (modal) modal.open(<ActualLrpModal actualLrp={this.props.actualLrp}/>);
  },

  mouseEnter() {
    var {desiredLrp, $selectedLrp} = this.props;
    $selectedLrp && $selectedLrp.set(desiredLrp);
  },

  mouseLeave() {
    var {$selectedLrp} = this.props;
    $selectedLrp && $selectedLrp.set(undefined);
  },

  render() {
    var {state, instance_guid: key, process_guid: processGuid} = this.props.actualLrp;
    var {denominator, desiredLrp, selected: hover} = this.props;
    var {scaling} = this.context;

    var flex;
    var undesired;
    var percentWidth = 1.0 / 50.0;
    var backgroundColor = pickColor(this.context.colors, processGuid);

    if (!desiredLrp) {
      undesired = true;
      backgroundColor = null;
    } else {
      if (scaling !== 'containers') {
        var numerator = desiredLrp[scaling];
        percentWidth = numerator/denominator;
        flex = numerator === 0;
      }
    }
    var style = {width: `${percentWidth*100}%`, backgroundColor: backgroundColor};
    var className = cx({container: true, claimed: state === 'CLAIMED', flex, undesired, hover});
    var props = {className, role: 'button', title: processGuid, style, key, 'data-instance-guid': key, onClick: this.click, onMouseEnter: this.mouseEnter, onMouseLeave: this.mouseLeave};
    return (<a {...props}/>);
  }
});

module.exports = Container;