require('../spec_helper');

describe('Page', function() {
  var subject, $receptor, Cursor;

  beforeEach(function() {
    Cursor = require('../../../app/lib/cursor');
    var Page = require('../../../app/components/page');
    var colors = ['#fff', '#000'];
    $receptor = new Cursor({}, jasmine.createSpy('callback'));
    React.withContext({scaling: 'containers', colors}, function() {
      subject = React.render(<Page {...{$receptor}}/>, root);
    });
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('when a desiredLrp is selected', function() {
    beforeEach(function() {
      var $receptor = new Cursor({selectedLrp: Factory.build('desiredLrp')}, jasmine.createSpy('callback'));
      subject.setProps({$receptor});
    });

    it('adds the selected class to the page', function() {
      expect('.page').toHaveClass('selected');
    });
  });
});
