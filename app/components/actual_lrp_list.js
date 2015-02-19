var ActualLrp = require('./actual_lrp');
var FastMixin = require('../mixins/fast_mixin');
var React = require('react/addons');
var sortBy = require('lodash.sortby');

var types = React.PropTypes;

var ActualLrpList = React.createClass({
  mixins: [FastMixin],

  propTypes: {
    actualLrps: types.array.isRequired,
    $hoverActualLrp: types.object.isRequired
  },

  ignoreFastProps: ['$hoverActualLrp'],

  renderActualLrps() {
    var {$hoverActualLrp} = this.props;
    return sortBy(this.props.actualLrps, a => a.index).map(function(actualLrp, position) {
      return (<ActualLrp {...{actualLrp, position, $hoverActualLrp, key: actualLrp.index}}/>);
    });
  },

  render() {
    return (<div className="actual-lrps"><table><tbody>{this.renderActualLrps()}</tbody></table></div>);
  }
});

module.exports = ActualLrpList;