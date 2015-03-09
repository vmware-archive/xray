var PureRenderMixin = require('../mixins/pure_render_mixin');
var HoverActualLrpMixin = require('../mixins/hover_actual_lrp_mixin');
var React = require('react/addons');
var Timeago = require('./timeago');

var cx = React.addons.classSet;
var types = React.PropTypes;

var ActualLrp = React.createClass({
  mixins: [PureRenderMixin, HoverActualLrpMixin],

  propTypes: {
    actualLrp: types.object.isRequired,
    position: types.number.isRequired,
    $hoverActualLrp: types.object.isRequired,
    isHover: types.bool
  },

  ignorePureRenderProps: ['$hoverActualLrp'],

  renderLrpState({state, cellId, placementError}) {
    state = state && state.toLowerCase();
    if(placementError) {
      return (
        <td className="phm" colSpan='2'><span className="state">{state}: </span>{placementError}</td>
      );
    }
    return [
      (<td className="phm state" key="0">{state}</td>),
      (<td className="phm type-ellipsis-1-line" key="1">{cellId}</td>)
    ];
  },

  render() {
    var {actualLrp, position, isHover} = this.props;
    var {cell_id: cellId, index, since, state, placement_error: placementError} = actualLrp;
    var odd = position % 2;
    var claimed = state === 'CLAIMED';
    var faded = state === 'UNCLAIMED' && !placementError;
    var crashed = state === 'CRASHED' || placementError;
    var backgroundClass = odd ? 'bg-dark-2' : 'bg-dark-1';
    if (crashed) backgroundClass = 'bg-error-1';
    if (isHover) backgroundClass = 'bg-accent-2';

    var className = cx({
      'actual-lrp': true,
      [backgroundClass]: true,
      faded, claimed
    });

    return (
      <tr className={className} key={index} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <td className="phm index txt-c">{index}</td>
        {this.renderLrpState({state, cellId, placementError})}
        <td className="phm since txt-r"><Timeago dateTime={new Date(since / 1000000)}/></td>
      </tr>
    );
  }
});

module.exports = ActualLrp;