require('../spec_helper');

describe('SidebarHeader', function() {
  var Cursor, subject, callbackSpy, $sidebar;
  beforeEach(function() {
    var SidebarHeader = require('../../../app/components/sidebar_header');
    Cursor = require('../../../app/lib/cursor');
    callbackSpy = jasmine.createSpy('callback');
    $sidebar = new Cursor({filter: '', sidebarCollapsed: false}, callbackSpy);
    subject = React.render(<SidebarHeader {...{$sidebar}}/>, root);
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
        $sidebar = new Cursor({filter: '', sidebarCollapsed: true}, callbackSpy);
        subject.setProps({$sidebar});
        $('.sidebar-toggle').simulate('click');
      });

      it('removes the collapsed class from the sidebar', function() {
        expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({sidebarCollapsed: false}));
      });
    });
  });
});

