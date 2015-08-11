require('babel/polyfill');
var Cursor = require('pui-cursor');
var googleAnalyticsMixin = require('../mixins/google_analytics_mixin');
var Layout = require('../../server/components/layout');
var Page = require('./page');
var React = require('react');
var {PortalDestination} = require('pui-react-portals');

var types = React.PropTypes;

function findClosestTime(receptorHistory, currentTime, receptor) {
  if (currentTime === 'now') return receptor;
  if (currentTime in receptorHistory) return receptorHistory[currentTime];
  var times = Object.keys(receptorHistory).sort().reverse();
  if (!times.length) return receptor;
  var time = times.find(time => Number(time) < Number(currentTime));
  if (time) return receptorHistory[time];
  return receptorHistory[times[0]];
}

var Application = React.createClass({
  mixins: [googleAnalyticsMixin],

  propTypes: {
    config: types.object.isRequired
  },

  childContextTypes: {
    colors: types.array.isRequired
  },

  getChildContext: function() {
    return {colors: this.props.config.colors};
  },

  getInitialState() {
    var receptor = {
      cells: [],
      desiredLrps: [],
      actualLrps: [],
      actualLrpsByProcessGuid: {},
      actualLrpsByCellId: {},
      desiredLrpsByProcessGuid: {}
    };

    return {
      receptor,
      scaling: 'memory_mb',
      selection: {
        hoverDesiredLrp: null,
        selectedDesiredLrp: null,
        hoverActualLrp: null,
        filteredLrps: {}
      },
      sidebar: {
        filter: '',
        sidebarCollapsed: false,
        hoverActualLrp: null
      },
      receptorUrl: this.props.config.receptorUrl,
      receptorHistory: {},
      slider: {
        currentTime: 'now',
        beginningOfTime: Date.now(),
        hoverTime: null,
        hoverPercentage: null
      }
    };
  },

  componentDidUpdate() {
    var {receptor, selection, sidebar, receptorHistory, slider} = this.state;
    Object.assign(xray, {receptor, selection, sidebar, receptorHistory, slider});
  },

  updateReceptor(receptor) {
    var {receptorHistory} = this.state;
    receptorHistory = {[Date.now()]: receptor, ...receptorHistory};
    this.setState({receptor, receptorHistory});
  },

  render() {
    var {receptorUrl, receptor, sidebar, selection, scaling, receptorHistory, slider} = this.state;
    var selectedReceptor = findClosestTime(receptorHistory, slider.currentTime, receptor);
    var previewReceptor = findClosestTime(receptorHistory, slider.hoverTime, receptor);
    var $slider = new Cursor(slider, slider => this.setState({slider}));
    var $receptor = new Cursor(receptor, this.updateReceptor);
    var $sidebar = new Cursor(sidebar, sidebar => this.setState({sidebar}));
    var $selection = new Cursor(selection, selection => this.setState({selection}));
    var $scaling = new Cursor(scaling, scaling => this.setState({scaling}));
    return (
      <div className="xray">
        <Page {...{$receptor, $sidebar, $selection, $scaling, receptorUrl, selectedReceptor, previewReceptor, $slider}} ref="page"/>
        <PortalDestination name="modal"/>
      </div>
    );
  }
});

Layout.init(Application);

module.exports = Application;
