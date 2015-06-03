var classnames = require('classnames');
var HoverDesiredLrpMixin = require('../mixins/hover_desired_lrp_mixin');
var Media = require('pui-react-media').Media;
var PureRenderMixin = require('pui-cursor/mixins/pure-render-mixin');
var React = require('react');
var SidebarContainer = require('./sidebar_container');
var DesiredLrpInfo = require('./desired_lrp_info');

var types = React.PropTypes;

var DesiredLrp = React.createClass({
  mixins: [PureRenderMixin, HoverDesiredLrpMixin],

  propTypes: {
    desiredLrp: types.object.isRequired,
    actualLrps: types.array.isRequired,
    sidebarCollapsed: types.bool,
    tag: types.string,
    $selection: types.object.isRequired,
    $sidebar: types.object.isRequired
  },

  getDefaultProps() {
    return {tag: 'div'};
  },

  contextTypes: {
    colors: types.array.isRequired
  },

  ignorePureRenderProps: ['$selection'],

  render() {
    var {actualLrps, desiredLrp, className, sidebarCollapsed, tag: Tag} = this.props;

    var {process_guid: processGuid} = desiredLrp;
    var claimed = actualLrps.some(({state}) => state === 'CLAIMED');
    var instancesRunning = actualLrps.filter(({state}) => state === 'RUNNING').length;
    var instancesError = instancesRunning < desiredLrp.instances;
    var desiredLrpInfo = (<DesiredLrpInfo {...{actualLrps, desiredLrp}}/>);
    className = classnames(className, 'desired-lrp', {error: instancesError});
    return (
      <Tag onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave} onClick={this.onClick} className={className}>
        <Media leftImage={<SidebarContainer {...{instancesError, desiredLrp, claimed, tooltip: sidebarCollapsed && desiredLrpInfo}}/>} key={processGuid} className="man">
          {desiredLrpInfo}
        </Media>
      </Tag>
    );
  }
});

module.exports = DesiredLrp;
