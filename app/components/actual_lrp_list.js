var ActualLrp = require('./actual_lrp');
var React = require('react/addons');
var sortBy = require('lodash.sortby');

var types = React.PropTypes;

var ActualLrpList = React.createClass({
  propTypes: {
    actualLrps: types.array.isRequired
  },

  renderActualLrps() {
    return sortBy(this.props.actualLrps, a => a.index).map(function(actualLrp, position) {
      return (<ActualLrp {...{actualLrp, position, key: actualLrp.index}}/>);
    });
  },

  render() {
    return (<div className="actual-lrps"><table><tbody>{this.renderActualLrps()}</tbody></table></div>);
  }
});

module.exports = ActualLrpList;