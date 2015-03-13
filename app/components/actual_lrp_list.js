var ActualLrp = require('./actual_lrp');
var PureRenderMixin = require('../mixins/pure_render_mixin');
var {findLrp} = require('../helpers/lrp_helper');
var React = require('react/addons');
var sortBy = require('lodash.sortby');

var types = React.PropTypes;

var ActualLrpList = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    actualLrps: types.array.isRequired,
    $hoverActualLrp: types.object.isRequired
  },

  renderActualLrps() {
    var {$hoverActualLrp} = this.props;
    return sortBy(this.props.actualLrps, a => a.index).map(function(actualLrp) {
      return (<ActualLrp {...{actualLrp, $hoverActualLrp, key: actualLrp.index}}/>);
    });
  },

  render() {
    return (<div className="actual-lrps type-neutral-6"><table><tbody>{this.renderActualLrps()}</tbody></table></div>);
  }
});

module.exports = ActualLrpList;