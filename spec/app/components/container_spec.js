require('../spec_helper');

describe('Container', function() {
  var Cursor, subject, modalSpy, update, selectionCallbackSpy, desiredLrp;
  beforeEach(function() {
    update = React.addons.update;
    var Container = require('../../../app/components/container');

    var actualLrp = Factory.build('actualLrp');
    desiredLrp = Factory.build('desiredLrp');
    var denominator = 50;

    modalSpy = jasmine.createSpyObj('modal', ['open']);

    Cursor = require('../../../app/lib/cursor');
    selectionCallbackSpy = jasmine.createSpy('callback');
    var $selection = new Cursor({hoverDesiredLrp: null}, selectionCallbackSpy);
    var $sidebar = new Cursor({sidebarCollapsed: false}, jasmine.createSpy('callback'));
    var scaling = 'containers';
    React.withContext({colors: ['#fff', '#000'], modal: modalSpy}, function() {
      subject = React.render(<Container {...{actualLrp, denominator, desiredLrp, scaling, className: '', $selection, $sidebar}}/>, root);
    });
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders a container', function() {
    expect('.app-container').toExist();
  });

  it('does not add the claimed class to the container', function() {
    expect(subject.props.actualLrp.state).toEqual('RUNNING');
    expect('.app-container').not.toHaveClass('claimed');
  });

  describe('when the state of the actual lrp is CLAIMED', function() {
    beforeEach(function() {
      subject.setProps({actualLrp: update(subject.props.actualLrp, {$merge: {state: 'CLAIMED'}})});
    });

    it('adds the claimed class', function() {
      expect('.app-container').toHaveClass('claimed');
    });
  });

  describe('when mouse over event is triggered on the container', function() {
    beforeEach(function() {
      $('.app-container').simulate('mouseOver');
    });

    it('sets the selected desiredLrp', function() {
      expect(selectionCallbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({hoverDesiredLrp: desiredLrp}));
    });

    describe('when mouse out is triggered on the container', function() {
      beforeEach(function() {
        $('.app-container').simulate('mouseOut');
        jasmine.clock().tick(1000);
      });

      it('unsets the desiredLrp on the receptor', function() {
        expect(selectionCallbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({hoverDesiredLrp: null}));
      });
    });
  });

  describe('when the desiredLrp is hovered', function() {
    beforeEach(function() {
      subject.setProps({className: 'selected'});
    });

    it('highlights the container', function() {
      expect('.app-container').toHaveClass('selected');
    });
  });

  describe('when the actual lrp is highlighted', function() {
    beforeEach(function() {
      subject.setProps({className: 'highlight'});
    });

    it('highlights the container', function() {
      expect('.app-container').toHaveClass('highlight');
    });
  });

  it('ignores the receptor cursor for rendering', function() {
    expect(subject.ignorePureRenderProps).toEqual(['$selection']);
  });
});