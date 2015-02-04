require('6to5/polyfill');
var ReceptorApi = require('../api/receptor_api');
var Layout = require('../../server/components/layout');
var Modal = require('./modal');
var React = require('react/addons');
var ReceptorUrlModal = require('./receptor_url_modal');
var Zones = require('./zones');

var types = React.PropTypes;

var Application = React.createClass({
  propTypes: {
    config: types.object.isRequired
  },

  childContextTypes: {
    cells: types.array,
    desiredLrps: types.array
  },

  getChildContext: function() {
    return this.state;
  },

  getInitialState() {
    return {cells: null, desiredLrps: null};
  },

  componentDidMount() {
    var {config} = this.props;

    if (config.receptorUrl) {
      this.fetchReceptorUrl(config.receptorUrl);
      return;
    }

    var {modal} = this.refs;
    modal.open(<ReceptorUrlModal onSubmit={this.updateReceptorUrl}/>);
  },

  fetchReceptorUrl(receptorUrl) {
    require('../api/base_api').baseUrl = receptorUrl;
    ReceptorApi.fetch().then(({cells, desiredLrps}) => this.setState({cells, desiredLrps}), reason => { console.error('DesiredLrps Promise failed because', reason); });
  },

  updateReceptorUrl({receptorUrl}) {
    this.fetchReceptorUrl(receptorUrl);
  },

  render() {
    var {cells} = this.state;
    return (
      <div className="xray">
        <Zones {...{cells}}/>
        <Modal ref="modal"/>
      </div>
    );
  }
});

Layout.init(Application);

module.exports = Application;