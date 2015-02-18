require('../spec_helper');

describe('Container', function() {
  var Cursor, subject, modalSpy, update, callbackSpy, desiredLrp;
  beforeEach(function() {
    update = React.addons.update;
    var Container = require('../../../app/components/container');

    var actualLrp = Factory.build('actualLrp');
    desiredLrp = Factory.build('desiredLrp');
    var denominator = 50;

    modalSpy = jasmine.createSpyObj('modal', ['open']);

    Cursor = require('../../../app/lib/cursor');
    callbackSpy = jasmine.createSpy('callback');
    var $hoverLrp = new Cursor({hoverLrp: null}, callbackSpy).refine('hoverLrp');
    React.withContext({colors: ['#fff', '#000'], scaling: 'containers', modal: modalSpy}, function() {
      subject = React.render(<Container {...{actualLrp, denominator, desiredLrp, isSelected: false, $hoverLrp}}/>, root);
    });
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders a container', function() {
    expect('.container').toExist();
  });

  it('does not add the claimed class to the container', function() {
    expect(subject.props.actualLrp.state).toEqual('RUNNING');
    expect('.container').not.toHaveClass('claimed');
  });

  describe('when the state of the actual lrp is CLAIMED', function() {
    beforeEach(function() {
      subject.setProps({actualLrp: update(subject.props.actualLrp, {$set: {state: 'CLAIMED'}})});
    });

    it('adds the claimed class', function() {
      expect('.container').toHaveClass('claimed');
    });
  });

  describe('when mouse over event is triggered on the container', function() {
    beforeEach(function() {
      $('.container').simulate('mouseOver');
    });

    it('sets the selected desiredLrp', function() {
      expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({hoverLrp: desiredLrp}));
    });

    describe('when mouse out is triggered on the container', function() {
      beforeEach(function() {
        $('.container').simulate('mouseOut');
      });

      it('unsets the desiredLrp on the receptor', function() {
        expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({hoverLrp: undefined}));
      });
    });
  });

  describe('when the desiredLrp is hovered', function() {
    beforeEach(function() {
      subject.setProps({isSelected: true});
    });

    it('highlights the container', function() {
      expect('.container').toHaveClass('selected');
    });
  });

  it('ignores the hover and selected lrp cursor', function() {
    expect(subject.ignoreFastProps).toEqual(['$hoverLrp', '$selectedLrp']);
  });

});