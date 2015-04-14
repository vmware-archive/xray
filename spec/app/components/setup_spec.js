require('../spec_helper');

describe('Setup', function() {
  var Setup;

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

  describe('when acceptTos is true', function() {
    beforeEach(function() {
      React.unmountComponentAtNode(root);
      React.render(<Setup config={{acceptTos: true}}/>, root);
    });

    it('pre-checks the accept tos checkbox', function() {
      expect('form :checkbox').toBeChecked();
    });
  });

  describe('when the form is submitted', function() {
    const receptorUrl = 'http://example.com';
    beforeEach(function() {
      $(':text').val(receptorUrl).simulate('change');
      $('form').simulate('submit');
    });

    it('makes an ajax request', function() {
      expect('/setup').toHaveBeenRequestedWith({method: 'POST', data: {receptor_url: receptorUrl}});
    });

    describe('when the ajax request is succcessful', function() {
      beforeEach(function() {
        jasmine.Ajax.requests.mostRecent().respondWith({
          status: 200
        });
        MockPromises.executeForResolvedPromises();
      });

      it('replaces the location with the root and receptor url as a query string', function() {
        expect(xray.location.replace).toHaveBeenCalledWith(`/?receptor=${receptorUrl}`);
      });
    });
  });
});