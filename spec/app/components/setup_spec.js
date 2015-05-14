require('../spec_helper');

describe('Setup', function() {
  var Setup, preventDefaultSpy, subject;
  const RECEPTOR_URL = 'receptor.example.com';

  beforeEach(function() {
    Setup = require('../../../app/components/setup');
    subject = React.render(<Setup config={{}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders a launch x-ray button', function() {
    expect('.main-header button').toHaveText('Launch X-Ray');
  });

  describe('#openModal', function() {
    var component;
    beforeEach(function() {
      component = <div/>;
      spyOn(subject.refs.modal, 'open');
      subject.openModal(component);
    });

    it('calls modal open', function() {
      expect(subject.refs.modal.open).toHaveBeenCalledWith(component);
    });
  });

  describe('when clicking on the launch x-ray button', function() {
    beforeEach(function() {
      $('.main-header button').simulate('click');
    });

    it('renders the launch modal', function() {
      expect('.launch-modal').toExist();
    });
  });
});