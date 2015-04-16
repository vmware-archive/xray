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

  describe('when there is a filter', function() {
    beforeEach(function() {
      var $sidebar = new Cursor({sidebarCollapsed: false, filter: desiredLrps[0].process_guid}, jasmine.createSpy('callback'));
      var $selection = new Cursor({filteredLrps: {[desiredLrps[0].process_guid]: desiredLrps[0]}});
      subject.setProps({$sidebar, $selection});
    });

    it('highlights all desired lrps', function() {
      expect('.desired-lrp:eq(0)').toHaveClass('hover');
    });
  });

  describe('when a desired lrp is hovered', function() {
    beforeEach(function() {
      var $selection = new Cursor({hoverDesiredLrp: desiredLrps[1]}, jasmine.createSpy('callback'));
      subject.setProps({$selection});
    });

    it('highlights the desired lrp', function() {
      expect('.desired-lrp:eq(0)').not.toHaveClass('hover');
      expect('.desired-lrp:eq(1)').toHaveClass('hover');
      expect('.desired-lrp:eq(2)').not.toHaveClass('hover');
    });
  });

  describe('when the sidebar is collapsed', function() {
    beforeEach(function() {
      var $sidebar = new Cursor({sidebarCollapsed: true}, jasmine.createSpy('callback'));
      subject.setProps({$sidebar});
    });

    describe('when there are no desired lrps', function() {
      beforeEach(function() {
        var $receptor = new Cursor({desiredLrps: []}, jasmine.createSpy('callback'));
        subject.setProps({$receptor});
      });

      it('does not render the empty text', function() {
        expect($(root)).not.toContainText('No filtered processes found.');
      });
    });
  });
});