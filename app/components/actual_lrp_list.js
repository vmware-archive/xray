var React = require('react/addons');
var sortBy = require('lodash.sortby');
var Timeago = require('./timeago');

var cx = React.addons.classSet;
var types = React.PropTypes;

var ActualLrpList = React.createClass({
  propTypes: {
    actualLrps: types.array.isRequired
  },

  renderActualLrp({cell_id: cellId, index, since, state}, i) {
    var odd = i % 2;
    var className = cx({'actual-lrp': true, 'bg-dark-1': odd, 'bg-dark-2': !odd});
    return (
      <tr className={className} key={index}>
        <td className="phm index txt-c">{index}</td>
        <td className="phm state">{state && state.toLowerCase()}</td>
        <td className="phm type-ellipsis-1-line">{cellId}</td>
        <td className="phm since txt-r"><Timeago dateTime={new Date(since / 1000000)}/></td>
      </tr>
    );
  },

  renderActualLrps() {
    return sortBy(this.props.actualLrps, a => a.index).map(this.renderActualLrp);
  },

  render() {
    return (<table className="actual-lrps"><tbody>{this.renderActualLrps()}</tbody></table>);
  }
});

module.exports = ActualLrpList;