require('../spec_helper');

describe('HoverDesiredLrpMixin', function() {
  var subject, desiredLrp, selectionCallbackSpy;
  beforeEach(function() {
    var HoverDesiredLrpMixin = require('../../../app/mixins/hover_desired_lrp_mixin');
    var Klass = React.createClass({
      mixins: [HoverDesiredLrpMixin],
      render() { return (<div onClick={this.onClick} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}/>); }
    });
    var Cursor = require('../../../app/lib/cursor');
    desiredLrp = Factory.build('desiredLrp');
    selectionCallbackSpy = jasmine.createSpy('selection');
    var $selection = new Cursor({filteredLrps: {[desiredLrp.process_guid]: desiredLrp}}, selectionCallbackSpy);
    var $sidebar = new Cursor({filter: 'filter'}, jasmine.createSpy('sidebar'));
    subject = React.render(<Klass {...{$selection, $sidebar, desiredLrp}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('#onMouseEnter', function () {
    describe('when the mouse over event is triggered', function () {
      beforeEach(function () {
        $(subject.getDOMNode()).simulate('mouseOver');
      });

      it('sets the hoverDesiredLrp to the desiredLrp', function() {
        expect(selectionCallbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({hoverDesiredLrp: desiredLrp}));
      });
    });

    describe('when the desiredLrp is not in the search filter', function() {
      beforeEach(function () {
        subject.setProps({desiredLrp: Factory.build('desiredLrp')});
      });

      describe('when the mouse over event is triggered', function () {
        beforeEach(function () {
          selectionCallbackSpy.calls.reset();
          $(subject.getDOMNode()).simulate('mouseOver');
        });

        it('does not select the desiredLrp', function() {
          expect(selectionCallbackSpy).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('#onClick', function() {
    describe('when clicked', function () {
      var stopPropagationSpy;
      beforeEach(function () {
        stopPropagationSpy = jasmine.createSpy('stopPropagation');
        $(subject.getDOMNode()).simulate('click', {stopPropagation: stopPropagationSpy});
      });

      it('stops progagation', function() {
        expect(stopPropagationSpy).toHaveBeenCalled();
      });

      it('selects the desiredLrp', function() {
        expect(selectionCallbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({selectedDesiredLrp: desiredLrp}));
      });
    });

    describe('when the desiredLrp is not in the search filter', function() {
      beforeEach(function () {
        subject.setProps({desiredLrp: Factory.build('desiredLrp')});
      });

      describe('when clicked', function () {
        beforeEach(function () {
          selectionCallbackSpy.calls.reset();
          $(subject.getDOMNode()).simulate('click');
        });

        it('does not select the desiredLrp', function() {
          expect(selectionCallbackSpy).not.toHaveBeenCalled();
        });
      });
    });
  });
});