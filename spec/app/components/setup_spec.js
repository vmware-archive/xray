require('../spec_helper');

describe('Setup', function() {
  var Setup;

  beforeEach(function() {
    Setup = require('../../../app/components/setup');
    React.render(<Setup config={{receptorUrl: 'http://example.com'}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders a launch x-ray button', function() {
    expect('.main-header button').toHaveText('Launch X-Ray');
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