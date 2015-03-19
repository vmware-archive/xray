require('../spec_helper');

describe('SidebarHeader', function() {
  var Cursor, lrpHelper, desiredLrps, subject, sidebarCallbackSpy, selectionCallbackSpy, $sidebar, $selection;
  beforeEach(function() {
    lrpHelper = require('../../../app/helpers/lrp_helper');
    spyOn(lrpHelper, 'filterDesiredLrps');

    var SidebarHeader = require('../../../app/components/sidebar_header');
    Cursor = require('../../../app/lib/cursor');

    desiredLrps = [];
    var $receptor = new Cursor({desiredLrps});

    sidebarCallbackSpy = jasmine.createSpy('$sidebar');
    $sidebar = new Cursor({filter: '', sidebarCollapsed: false}, sidebarCallbackSpy);

    selectionCallbackSpy = jasmine.createSpy('$selection');
    $selection = new Cursor({filteredLrps: []}, selectionCallbackSpy);

    subject = React.render(<SidebarHeader {...{$receptor, $sidebar, $selection}}/>, root);
  });

  it('sets the filter when the user types', function() {
    $('.sidebar-header :text').val('foo').simulate('change');
    expect(sidebarCallbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({filter: 'foo'}));
  });

  it('saves the search results as filteredLrps on the $selection cursor', function() {
    var filteredLrps = [];
    lrpHelper.filterDesiredLrps.and.returnValue(filteredLrps);

    $('.sidebar-header :text').val('foo').simulate('change');
    expect(lrpHelper.filterDesiredLrps).toHaveBeenCalledWith(desiredLrps, 'foo');

    expect(selectionCallbackSpy).toHaveBeenCalledWith({filteredLrps});
  });

  it('sets the search results to null when the user removes the filter text', function() {
    var filteredLrps = [];
    lrpHelper.filterDesiredLrps.and.returnValue(filteredLrps);
    $('.sidebar-header :text').val('foo').simulate('change');
    selectionCallbackSpy.calls.reset();
    $('.sidebar-header :text').val('').simulate('change');
    expect(selectionCallbackSpy).toHaveBeenCalledWith({filteredLrps: {}});
  });

  describe('when clicking on the sidebar toggle', function() {
    beforeEach(function() {
      $('.sidebar-toggle').simulate('click');
    });

    it('calls the receptor callback with a toggled sidebar collapsed', function() {
      expect(sidebarCallbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({sidebarCollapsed: true}));
    });

    describe('when clicking on the sidebar toggle again', function() {
      beforeEach(function() {
        $sidebar = new Cursor({filter: '', sidebarCollapsed: true}, sidebarCallbackSpy);
        subject.setProps({$sidebar});
        $('.sidebar-toggle').simulate('click');
      });

      it('removes the collapsed class from the sidebar', function() {
        expect(sidebarCallbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({sidebarCollapsed: false}));
      });
    });
  });
});

