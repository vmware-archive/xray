var PureRenderMixin = require('../mixins/pure_render_mixin');
var PUI = Object.assign({}, require('../vendor/modals'), require('../vendor/buttons'));
var React = require('react/addons');

var ReceptorUrlModal = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {receptorUrl: ''};
  },

  componentDidMount() {
    this.refs.modal.open();
  },

  closeModal() {
    this.refs.modal.close();
  },

  change(e) {
    this.setState({receptorUrl: e.target.value});
  },

  submit(e) {
    e.preventDefault();
    var {receptorUrl} = this.state;
    this.props.onSubmit && this.props.onSubmit({receptorUrl});
    this.closeModal();
  },

  render() {
    return (
      <form className="receptor-url-modal" onSubmit={this.submit}>
        <PUI.Modal title="Please Enter A Receptor Url" ref="modal">
          <PUI.ModalBody>
            <input type="text" onChange={this.change} autoFocus/>
          </PUI.ModalBody>
          <PUI.ModalFooter>
            <PUI.LowlightButton onClick={this.closeModal}>Close</PUI.LowlightButton>
            <PUI.HighlightButton type="submit">Submit</PUI.HighlightButton>
          </PUI.ModalFooter>
        </PUI.Modal>
      </form>
    );
  }
});

module.exports = ReceptorUrlModal;