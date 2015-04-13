require('../spec_helper');

describe('ReceptorUrlModal', function() {
  var Modal, submitSpy;

  beforeEach(function() {
    Modal = require('pui-react-modals').Modal;
    jasmineReact.spyOnClass(Modal, 'open').and.callThrough();
    jasmineReact.spyOnClass(Modal, 'close');
    var ReceptorUrlModal = require('../../../app/components/receptor_url_modal');
    submitSpy = jasmine.createSpy('submit');
    React.render(<ReceptorUrlModal onSubmit={submitSpy}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('opens the modal', function() {
    expect(Modal.type.prototype.open).toHaveBeenCalled();
  });

  describe('when the user enters a url and clicks submit', function() {
    var preventDefaultSpy;
    beforeEach(function() {
      $(':text').val('www.example.com').simulate('change');
      preventDefaultSpy = jasmine.createSpy('preventDefault');
      $('form').simulate('submit', {preventDefault: preventDefaultSpy});
    });

    it('does not actually submit the form', function() {
      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('calls onSubmit with the url', function() {
      expect(submitSpy).toHaveBeenCalledWith({receptorUrl: 'www.example.com'});
    });

    it('closes the modal', function() {
      expect(Modal.type.prototype.close).toHaveBeenCalled();
    });
  });
});