require('../spec_helper');

describe('Setup', function() {
  var Setup, preventDefaultSpy;
  const RECEPTOR_URL = 'receptor.example.com';

  beforeEach(function() {
    Setup = require('../../../app/components/setup');
    React.render(<Setup config={{}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders a form', function() {
    expect('form').toExist();
  });

  describe('when there is a receptor url', function() {
    beforeEach(function() {
      React.unmountComponentAtNode(root);
      React.render(<Setup config={{receptorUrl: RECEPTOR_URL}}/>, root);
    });

    it('pre-fills the receptor input', function() {
      expect('form :text').toHaveValue(RECEPTOR_URL);
    });
  });

  it('posts the right data to setup when the form is submitted', function() {
    expect('form').toHaveAttr('method', 'POST');
    expect('form').toHaveAttr('action', '/setup');
    expect(':text').toHaveAttr('name', 'receptor_url');
  });

  describe('when the form is submitted with valid data', function() {
    beforeEach(function() {
      preventDefaultSpy = jasmine.createSpy('preventDefault');
      $(':text').val(RECEPTOR_URL).simulate('change');
      $('form').simulate('submit', {preventDefault: preventDefaultSpy});
    });

    it('allows the form to post to the server', function() {
      expect(preventDefaultSpy).not.toHaveBeenCalled();
    });
  });

  describe('when the form is submitted with no receptor url', function() {
    beforeEach(function() {
      preventDefaultSpy = jasmine.createSpy('preventDefault');
      $('form').simulate('submit', {preventDefault: preventDefaultSpy});
    });

    it('displays an error', function() {
      expect('.has-error').toExist();
    });

    it('does not submit the form', function() {
      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });
});