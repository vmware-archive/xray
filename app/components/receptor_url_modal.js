var HighlightButton = require('pui-react-buttons').HighlightButton;
var LowlightButton = require('pui-react-buttons').LowlightButton;
var Modal = require('pui-react-modals').Modal;
var ModalBody = require('pui-react-modals').ModalBody;
var ModalFooter = require('pui-react-modals').ModalFooter;
var PureRenderMixin = require('../mixins/pure_render_mixin');
var React = require('react/addons');
var types = React.PropTypes;

var ReceptorUrlModal = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    onSubmit: types.func
  },

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
        <Modal title="Please Enter A Receptor Url" ref="modal">
          <ModalBody>
            <input type="text" onChange={this.change} autoFocus/>
          </ModalBody>
          <ModalFooter>
            <LowlightButton onClick={this.closeModal}>Close</LowlightButton>
            <HighlightButton type="submit">Submit</HighlightButton>
          </ModalFooter>
        </Modal>
      </form>
    );
  }
});

module.exports = ReceptorUrlModal;