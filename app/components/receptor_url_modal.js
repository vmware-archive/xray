var React = require('react/addons');
var PUI = Object.assign(require('../vendor/modals'), require('../vendor/buttons'));

var ReceptorUrlModal = React.createClass({
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
            <PUI.PrimaryButton type="submit">Submit</PUI.PrimaryButton>
            <PUI.DefaultButton onClick={this.closeModal}>Close</PUI.DefaultButton>
          </PUI.ModalFooter>
        </PUI.Modal>
      </form>
    );
  }
});

module.exports = ReceptorUrlModal;