require('../spec_helper');

describe('ActualLrp', function() {
  var actualLrp, subject, hoverSpy;
  beforeEach(function() {
    var ActualLrp = require('../../../app/components/actual_lrp');
    var Cursor = require('../../../app/lib/cursor');
    actualLrp = Factory.build('actualLrp');
    hoverSpy = jasmine.createSpy('hoverCallback');
    var $hoverActualLrp = new Cursor({hoverActualLrp: null}, hoverSpy).refine('hoverActualLrp');
    var $hoverSidebarActualLrp = new Cursor({hoverSidebarActualLrp: null}, jasmine.createSpy('callback')).refine('hoverActualLrp');
    var table = $('<table/>').appendTo(root)[0];
    subject = React.render(<ActualLrp {...{position: 0, actualLrp, $hoverActualLrp, $hoverSidebarActualLrp}}/>, table);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('when the state is crashed', function() {
    beforeEach(function() {
      actualLrp = Factory.build('actualLrp', {state: 'CRASHED'});
      subject.setProps({actualLrp});
    });

    it('adds the error class', function() {
      expect('.error').toExist();
    });
  });

  describe('when the state is claimed', function() {
    beforeEach(function() {
      actualLrp = Factory.build('actualLrp', {state: 'CLAIMED'});
      subject.setProps({actualLrp});
    });

    it('adds the claimed class', function() {
      expect('.claimed').toExist();
    });
  });

  describe('when the mouse over event is triggered on the component', function() {
    beforeEach(function() {
      $(subject.getDOMNode()).simulate('mouseOver');
    });

    it('sets the hover actual lrp', function() {
      expect(hoverSpy).toHaveBeenCalledWith(jasmine.objectContaining({hoverActualLrp: actualLrp}));
    });
  });

  describe('when the mouse out event is triggered on the component', function() {
    beforeEach(function() {
      $(subject.getDOMNode()).simulate('mouseOut');
    });

    it('sets the hover actual lrp', function() {
      expect(hoverSpy).toHaveBeenCalledWith(jasmine.objectContaining({hoverActualLrp: null}));
    });
  });

  it('ignores the hover lrp cursor for rendering', function() {
    expect(subject.ignorePureRenderProps).toEqual(['$hoverActualLrp', '$hoverSidebarActualLrp']);
  });
});