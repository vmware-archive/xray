var React = require('react/addons');
var FastMixin = require('../mixins/fast_mixin');
var PUI = Object.assign(require('../vendor/modals'), require('../vendor/buttons'));

var types = React.PropTypes;

var ActualLrpModal = React.createClass({
  mixins: [FastMixin],

  propTypes: {
    actualLrp: types.object.isRequired
  },

  componentDidMount() {
    this.refs.modal.open();
  },

  componentWillUpdate() {
    this.refs.modal.open();
  },

  closeModal() {
    this.refs.modal.close();
  },

  render() {
    var {actualLrp} = this.props;
    return (
      <PUI.Modal title="Container" ref="modal">
        <PUI.ModalBody>
          Process guid is {actualLrp.process_guid}
        </PUI.ModalBody>
        <PUI.ModalFooter>
          <PUI.DefaultButton onClick={this.closeModal}>Close</PUI.DefaultButton>
        </PUI.ModalFooter>
      </PUI.Modal>
    );
  }
});

module.exports = ActualLrpModal;