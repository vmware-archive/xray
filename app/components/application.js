require('babel/polyfill');
var Cursor = require('../lib/cursor');
var Layout = require('../../server/components/layout');
var Modal = require('./modal');
var Page = require('./page');
var React = require('react/addons');
var ReceptorUrlApi = require('../api/receptor_url_api');
var ReceptorUrlModal = require('./receptor_url_modal');

var types = React.PropTypes;

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
    return {
      receptor: {
        cells: [],
        desiredLrps: [],
        actualLrps: []
      },
      selection: {
        hoverDesiredLrp: null,
        selectedDesiredLrp: null,
        hoverActualLrp: null
      },
      sidebar: {
        filter: '',
        sidebarCollapsed: false
      },
      receptorUrl: this.props.config.receptorUrl
    };
  },

  componentDidMount() {
    var {modal} = this.refs;
    if (!this.state.receptorUrl) {
      modal.open(<ReceptorUrlModal onSubmit={this.updateReceptorUrl}/>);
    }
  },

  componentDidUpdate() {
    var {receptor, selection, sidebar} = this.state;
    Object.assign(xray, {receptor, selection, sidebar});
  },

  updateReceptorUrl({receptorUrl}) {
    ReceptorUrlApi.create({receptorUrl})
                  .then(() => this.setState({receptorUrl}));
  },

  render() {
    var {receptorUrl, receptor, sidebar, selection} = this.state;
    var $receptor = new Cursor(receptor, receptor => this.setState({receptor}));
    var $sidebar = new Cursor(sidebar, sidebar => this.setState({sidebar}));
    var $selection = new Cursor(selection, selection => this.setState({selection}));
    return (
      <div className="xray">
        <Page {...{$receptor, $sidebar, $selection, receptorUrl}} ref="page">
          <Modal ref="modal"/>
        </Page>
      </div>
    );
  }
});

Layout.init(Application);

module.exports = Application;
