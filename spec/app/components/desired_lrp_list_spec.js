require('../spec_helper');
describe('DesiredLrpList', function() {
  var Cursor, subject, desiredLrps;
  beforeEach(function() {
    var DesiredLrpList = require('../../../app/components/desired_lrp_list');
    Cursor = require('../../../app/lib/cursor');
    desiredLrps = Factory.buildList('desiredLrp', 3);

    var $receptor = new Cursor({desiredLrps}, jasmine.createSpy('callback'));
    var $sidebar = new Cursor({sidebarCollapsed: false}, jasmine.createSpy('callback'));
    var $selection = new Cursor({}, jasmine.createSpy('callback'));
    var colors = ['#fff', '#000'];
    React.withContext({colors}, function() {
      subject = React.render(<DesiredLrpList {...{$receptor, $selection, $sidebar}}/>, root);
    });
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('when the sidebar is collapsed', function() {
    beforeEach(function() {
      var $sidebar = new Cursor({sidebarCollapsed: true}, jasmine.createSpy('callback'));
      subject.setProps({$sidebar});
    });

    it('does not stripe the desired lrp', function() {
      expect($('.bg-dark-1')).not.toExist();
    });
  });
});