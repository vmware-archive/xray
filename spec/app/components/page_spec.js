require('../spec_helper');

describe('Page', function() {
  var subject, $receptor, Cursor, actualLrps, callbackSpy;

  beforeEach(function() {
    Cursor = require('../../../app/lib/cursor');
    var Page = require('../../../app/components/page');
    actualLrps = [
      Factory.build('actualLrp'),
      Factory.build('actualLrp', {instance_guid: null})
    ];
    var colors = ['#fff', '#000'];

    callbackSpy = jasmine.createSpy('callback');
    $receptor = new Cursor({actualLrps}, callbackSpy);
    React.withContext({scaling: 'containers', colors}, function() {
      subject = React.render(<Page {...{$receptor}}/>, root);
    });
    subject.setProps({receptorUrl: 'http://example.com'});
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('when a desiredLrp is selected', function() {
    beforeEach(function() {
      var $receptor = new Cursor({selectedLrp: Factory.build('desiredLrp')}, jasmine.createSpy('callback'));
      subject.setProps({$receptor});
    });

    it('adds the selection class to the page', function() {
      expect('.page').toHaveClass('selection');
    });
  });

  describe('event stream', function() {
    describe('when an actual_lrp change event is received', function() {
      beforeEach(function() {
        mockEventSource.trigger('actual_lrp_changed', {
          actual_lrp_before: actualLrps[1],
          actual_lrp_after: Object.assign({}, actualLrps[1], {state: 'CLAIMED', instance_guid: '123'})
        });
      });
      it('updates the receptor with the new lrp', function() {
        expect(callbackSpy).toHaveBeenCalled();
        expect(callbackSpy.calls.mostRecent().args[0].actualLrps[1].state).toEqual('CLAIMED');
      });
    });

    describe('when an actual_lrp created event is received', function() {
      var actualLrp;
      beforeEach(function() {
        actualLrp = Factory.build('actualLrp');
        mockEventSource.trigger('actual_lrp_created', {
          actual_lrp: actualLrp
        });
      });
      it('adds the actual lrp to the receptor', function() {
        expect(callbackSpy).toHaveBeenCalled();
        expect(callbackSpy.calls.mostRecent().args[0].actualLrps).toContain(actualLrp);
      });
    });

    describe('when an actual_lrp removed event is received', function() {
      beforeEach(function() {
        mockEventSource.trigger('actual_lrp_removed', {
          actual_lrp: actualLrps[1]
        });
      });

      it('removes the actual lrp from the receptor', function() {
        expect(callbackSpy).toHaveBeenCalled();
        expect(callbackSpy.calls.mostRecent().args[0].actualLrps).not.toContain(actualLrps[1]);
      });
    });
  });
});
