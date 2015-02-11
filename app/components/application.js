require('6to5/polyfill');
var Cursor = require('../lib/cursor');
var Layout = require('../../server/components/layout');
var Modal = require('./modal');
var Page = require('./page');
var React = require('react/addons');
var ReceptorUrlModal = require('./receptor_url_modal');
var Zones = require('./zones');

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
    return {receptor: {cells: [], desiredLrps: [], actualLrps: []}, receptorUrl: this.props.config.receptorUrl};
  },

  componentDidMount() {
    var {modal} = this.refs;
    if (!this.state.receptorUrl) {
      modal.open(<ReceptorUrlModal onSubmit={this.updateReceptorUrl}/>);
    }
  },

  updateReceptorUrl({receptorUrl}) {
    this.setState({receptorUrl});
  },

  render() {
    var {receptorUrl} = this.state;
    var $receptor = new Cursor(this.state.receptor, receptor => this.setState({receptor}));
    return (
      <div className="xray">
        <Page {...{$receptor, receptorUrl}} ref="page">
          <Zones {...this.state.receptor}/>
          <Modal ref="modal"/>
        </Page>
      </div>
    );
  }
});

Layout.init(Application);

module.exports = Application;
