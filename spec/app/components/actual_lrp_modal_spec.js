require('../spec_helper');

describe('ActualLrpModal', function() {
  var Modal, subject, actualLrp;
  beforeEach(function() {
    Modal = require('../../../app/vendor/modals').Modal;
    jasmineReact.spyOnClass(Modal, 'open').and.callThrough();
    jasmineReact.spyOnClass(Modal, 'close');
    var ActualLrpModal = require('../../../app/components/actual_lrp_modal');
    actualLrp = Factory.build('actualLrp');
    subject = React.render(<ActualLrpModal actualLrp={actualLrp}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('opens the modal', function() {
    expect(Modal.type.prototype.open).toHaveBeenCalled();
  });

  it('renders the process guid', function() {
    expect('.modal').toContainText(`Process guid is ${actualLrp.process_guid}`);
  });

  describe('when the button is clicked', function() {
    it('closes the modal', function() {
      $('button').simulate('click')
      expect(Modal.type.prototype.close).toHaveBeenCalled();
    });
  });
});