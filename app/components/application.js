require('6to5/polyfill');
var BaseApi = require('../api/base_api');
var Layout = require('../../server/components/layout');
var Modal = require('./modal');
var React = require('react/addons');
var ReceptorApi = require('../api/receptor_api');
var ReceptorUrlModal = require('./receptor_url_modal');
var Zones = require('./zones');
var {setCorrectingInterval} = require('correcting-interval');
var {diff} = require('../helpers/array_helper');

var types = React.PropTypes;
var update = React.addons.update;

function applyUpdate(newArr, id, changeCallback) {
  return {
    $apply: function(oldArr) {
      var {added, removed, changed} = diff(oldArr, newArr, id, changeCallback);
      var results = oldArr.filter(x => !removed.includes(x));
      if (changed && changed.length) {
        /* jshint unused:false */
        var currentChanged = changed.map(([current, next]) => current);
        var nextChanged = changed.map(([current, next]) => next);
        /* jshint unused:true */
        results = results.map(x => currentChanged.includes(x) ? nextChanged[currentChanged.indexOf(x)] : x);
      }
      return results.concat(added);
    }
  };
}

var Application = React.createClass({
  propTypes: {
    config: types.object.isRequired
  },

  childContextTypes: {
    colors: types.array.isRequired,
    modal: types.object
  },

  getChildContext: function() {
    return {colors: this.props.config.colors, modal: this.refs.modal};
  },

  getInitialState() {
    return {receptor: {cells: [], desiredLrps: [], actualLrps: []}};
  },

  statics: {
    POLL_INTERVAL: 10000
  },

  componentDidMount() {
    var {config} = this.props;

    if (config.receptorUrl) {
      BaseApi.baseUrl = config.receptorUrl;
      this.pollReceptor();
      return;
    }
    var {modal} = this.refs;
    modal.open(<ReceptorUrlModal onSubmit={this.updateReceptorUrl}/>);
  },

  updateReceptor() {
    return ReceptorApi.fetch().then(function({actualLrps, cells, desiredLrps}) {
        var receptor = update(this.state.receptor, {
          cells: applyUpdate(cells, 'cell_id'),
          actualLrps: applyUpdate(actualLrps, 'instance_guid', (a, b) => a.since !== b.since),
          desiredLrps: applyUpdate(desiredLrps, 'process_guid')
        });
        this.setState({receptor});
    }.bind(this),
        reason => console.error('DesiredLrps Promise failed because', reason)
    );
  },

  pollReceptor() {
    this.updateReceptor();
    setCorrectingInterval(this.updateReceptor, Application.POLL_INTERVAL);
  },

  updateReceptorUrl({receptorUrl}) {
    BaseApi.baseUrl = receptorUrl;
    this.pollReceptor();
  },

  render() {
    return (
      <div className="xray">
        <Zones {...this.state.receptor}/>
        <Modal ref="modal"/>
      </div>
    );
  }
});

Layout.init(Application);

module.exports = Application;
