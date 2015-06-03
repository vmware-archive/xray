var PureRenderMixin = require('pui-cursor/mixins/pure-render-mixin');
var HoverActualLrpMixin = require('../mixins/hover_actual_lrp_mixin');
var React = require('react');
var Timeago = require('./timeago');
var classnames = require('classnames');

var types = React.PropTypes;

var ActualLrp = React.createClass({
  mixins: [PureRenderMixin, HoverActualLrpMixin],

  propTypes: {
    actualLrp: types.object.isRequired,
    $hoverActualLrp: types.object.isRequired,
    $hoverSidebarActualLrp: types.object.isRequired
  },

  ignorePureRenderProps: ['$hoverActualLrp', '$hoverSidebarActualLrp'],

  renderLrpState({state, cellId, placementError}) {
    state = state && state.toLowerCase();
    if(placementError) {
      return (
        <td className="phm" colSpan="2"><span className="state">{state}: </span>{placementError}</td>
      );
    }
    return [
      (<td className="phm state" key="0">{state}</td>),
      (<td className="phm type-ellipsis-1-line" key="1">{cellId}</td>)
    ];
  },

  render() {
    var {actualLrp, className} = this.props;
    var {cell_id: cellId, index, since, state, placement_error: placementError} = actualLrp;
    var claimed = state === 'CLAIMED';
    var faded = state === 'UNCLAIMED' && !placementError;
    var crashed = state === 'CRASHED' || placementError;

    var classes = classnames(
      className,
      {
        'actual-lrp': true,
        'error': crashed,
        faded, claimed
      }
    );

    return (
      <tr className={classes} key={index} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        <td className="phm index txt-c">{index}</td>
        {this.renderLrpState({state, cellId, placementError})}
        <td className="phm since txt-l"><Timeago dateTime={new Date(since / 1000000)}/></td>
      </tr>
    );
  }
});

module.exports = ActualLrp;