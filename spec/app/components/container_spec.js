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
    var $selectedLrp = new Cursor({selectedLrp: null}, callbackSpy).refine('selectedLrp');
    React.withContext({colors: ['#fff', '#000'], scaling: 'containers', modal: modalSpy}, function() {
      subject = React.render(<Container {...{actualLrp, denominator, desiredLrp, $selectedLrp}}/>, root);
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

  describe('when clicking on the container', function() {
    beforeEach(function() {
      $('.container').simulate('click');
    });

    it('opens a modal', function() {
      expect(modalSpy.open).toHaveBeenCalled();
    });
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
      expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({selectedLrp: desiredLrp}));
    });

    describe('when mouse out is triggered on the container', function() {
      beforeEach(function() {
        $('.container').simulate('mouseOut');
      });

      it('unsets the desiredLrp on the receptor', function() {
        expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({selectedLrp: undefined}));
      });
    });
  });

  describe('when the desiredLrp is selected', function() {
    beforeEach(function() {
      var $selectedLrp = new Cursor({selectedLrp: desiredLrp}, callbackSpy).refine('selectedLrp');
      subject.setProps({$selectedLrp});
    });

    it('highlights the container', function() {
      expect('.container').toHaveClass('hover');
    });
  });

  describe('when a different desiredLrp is selected', function() {
    beforeEach(function() {
      var $selectedLrp = new Cursor({selectedLrp: Factory.build('desiredLrp')}, callbackSpy).refine('selectedLrp');
      subject.setProps({$selectedLrp});
    });

    it('fades the container', function() {
      expect('.container').toHaveClass('faded');
    });
  });
});