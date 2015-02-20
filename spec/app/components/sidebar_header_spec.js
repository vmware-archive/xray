require('../spec_helper');

describe('SidebarHeader', function() {
  var subject, callbackSpy;
  beforeEach(function() {
    var SidebarHeader = require('../../../app/components/sidebar_header');
    var Cursor = require('../../../app/lib/cursor');
    callbackSpy = jasmine.createSpy('callback');
    var $filter = new Cursor({filter: ''}, callbackSpy).refine('filter');
    subject = React.render(<SidebarHeader {...{hasDetails: false, $filter}}/>, root);
  });

  it('sets the filter when the user types', function() {
    $('.sidebar-header :text').val('foo').simulate('change');
    expect(callbackSpy).toHaveBeenCalledWith({filter: 'foo'});
  });

  describe('when has details is true', function() {
    beforeEach(function() {
      subject.setProps({hasDetails: true});
    });

    it('does not render the filter', function() {
      expect('input[type=text]').not.toExist();
    });
  });
});

