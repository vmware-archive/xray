require('../spec_helper');

describe('SidebarHeader', function() {
  var Cursor, subject, callbackSpy, $receptor;
  beforeEach(function() {
    var SidebarHeader = require('../../../app/components/sidebar_header');
    Cursor = require('../../../app/lib/cursor');
    callbackSpy = jasmine.createSpy('callback');
    $receptor = new Cursor({filter: '', sidebarCollapsed: false}, callbackSpy);
    subject = React.render(<SidebarHeader {...{$receptor}}/>, root);
  });

  it('sets the filter when the user types', function() {
    $('.sidebar-header :text').val('foo').simulate('change');
    expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({filter: 'foo'}));
  });

  describe('when clicking on the sidebar toggle', function() {
    beforeEach(function() {
      $('.sidebar-toggle').simulate('click');
    });

    it('calls the receptor callback with a toggled sidebar collapsed', function() {
      expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({sidebarCollapsed: true}));
    });

    describe('when clicking on the sidebar toggle again', function() {
      beforeEach(function() {
        $receptor = new Cursor({filter: '', sidebarCollapsed: true}, callbackSpy);
        subject.setProps({$receptor});
        $('.sidebar-toggle').simulate('click');
      });

      it('removes the collapsed class from the sidebar', function() {
        expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({sidebarCollapsed: false}));
      });
    });
  });
});

