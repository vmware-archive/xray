require('../spec_helper');

describe('Sidebar', function() {
  var subject, $receptor, desiredLrps;
  beforeEach(function() {
    var Sidebar = require('../../../app/components/sidebar');
    desiredLrps = Factory.buildList('desiredLrp', 3);
    var Cursor = require('../../../app/lib/cursor');
    $receptor = new Cursor({desiredLrps}, jasmine.createSpy('callback'));
    var colors = ['#fff', '#000'];
    React.withContext({colors}, function() {
      subject = React.render(<Sidebar {...{$receptor}}/>, root);
    });
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders desired lrps', function() {
    expect($('.media')).toHaveLength(desiredLrps.length);
  });
});