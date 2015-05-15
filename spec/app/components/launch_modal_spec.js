require('../spec_helper');

describe('LaunchModal', function() {
  const RECEPTOR_URL = 'receptor.example.com';
  var LaunchModal, Modal;

  beforeEach(function() {
    Modal = require('pui-react-modals').Modal;
    jasmineReact.spyOnClass(Modal, 'open').and.callThrough();
    jasmineReact.spyOnClass(Modal, 'close');
    LaunchModal = require('../../../app/components/launch_modal');
    React.render(<LaunchModal config={{receptorUrl: ''}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('opens the modal', function() {
    expect(Modal.type.prototype.open).toHaveBeenCalled();
  });

  it('disables the launch x-ray button', function() {
    expect('.launch-modal :submit:disabled').toExist();
  });

  it('posts the right data to setup when the form is submitted', function() {
    expect('form').toHaveAttr('method', 'POST');
    expect('form').toHaveAttr('action', '/setup');
    expect('#username').toHaveAttr('name', 'username');
    expect('#password').toHaveAttr('name', 'password');
    expect('#receptor-url').toHaveAttr('name', 'receptor_url');
  });

  describe('when filling in the receptor url', function() {
    it('enables the launch x-ray button', function() {
      $('#receptor-url').val('http://example.com').simulate('change');
      expect('.launch-modal :submit:disabled').not.toExist();
    });
  });

  describe('when clicking on the close button', function() {
    beforeEach(function() {
      $('.modal-footer button:contains("Close")').simulate('click');
    });

    it('closes the modal', function() {
      expect(Modal.type.prototype.close).toHaveBeenCalled();
    });
  });

  describe('when there is a receptor url', function() {
    beforeEach(function() {
      React.unmountComponentAtNode(root);
      React.render(<LaunchModal config={{receptorUrl: RECEPTOR_URL}}/>, root);
    });

    it('pre-fills the receptor input', function() {
      expect('#receptor-url').toHaveValue(RECEPTOR_URL);
    });
  });
});