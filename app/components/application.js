require('6to5/polyfill');
var CellsApi = require('../api/cells_api');
var Cells = require('./cells');
var Layout = require('../../server/components/layout');
var Modal = require('./modal');
var React = require('react/addons');
var ReceptorUrlModal = require('./receptor_url_modal');

var types = React.PropTypes;

var Application = React.createClass({
  propTypes: {
    config: types.object.isRequired
  },

  getInitialState() {
    return {cells: null};
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
    CellsApi.baseUrl = receptorUrl;
    CellsApi.fetch().then(function({cells}) {
      this.setState({cells});
    }.bind(this));
  },

  updateReceptorUrl({receptorUrl}) {
    this.fetchReceptorUrl(receptorUrl);
  },

  render() {
    var {cells} = this.state;
    return (
      <div className="xray">
        <Cells {...{cells}}/>
        <Modal ref="modal"/>
      </div>
    );
  }
});

Layout.init(Application);

module.exports = Application;