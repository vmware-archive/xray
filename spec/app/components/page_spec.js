require('../spec_helper');

describe('Page', function() {
  var subject, $receptor, Cursor, actualLrps, desiredLrps, callbackSpy;

  beforeEach(function() {
    Cursor = require('../../../app/lib/cursor');
    var Page = require('../../../app/components/page');
    actualLrps = [
      Factory.build('actualLrp'),
      Factory.build('actualLrp', {instance_guid: null})
    ];
    desiredLrps = Factory.buildList('desiredLrp', 2);

    var colors = ['#fff', '#000'];

    callbackSpy = jasmine.createSpy('callback');
    $receptor = new Cursor({actualLrps, desiredLrps}, callbackSpy);
    React.withContext({scaling: 'containers', colors}, function() {
      subject = React.render(<Page {...{$receptor}}/>, root);
    });
    subject.setProps({receptorUrl: 'http://example.com'});
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('when there is a selected lrp', function() {
    var selectedDesiredLrpCallbackSpy;
    beforeEach(function() {
      selectedDesiredLrpCallbackSpy = jasmine.createSpy('callback');
      var desiredLrp = Factory.build('desiredLrp');
      var $receptor = new Cursor({selectedDesiredLrp: desiredLrp, hoverDesiredLrp: desiredLrp}, selectedDesiredLrpCallbackSpy);
      subject.setProps({$receptor});
    });

    it('renders a scrim', function() {
      expect('.scrim').toExist();
    });

    it('adds the selection class to the page', function() {
      expect('.page').toHaveClass('selection');
    });

    describe('when clicking on the scrim', function() {
      beforeEach(function() {
        $('.scrim').simulate('click');
      });
      it('removes the selected lrp', function() {
        expect(selectedDesiredLrpCallbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({selectedDesiredLrp: null, hoverDesiredLrp: null}));
      });
    });
  });

  describe('when a desiredLrp is hovered', function() {
    beforeEach(function() {
      var $receptor = new Cursor({hoverDesiredLrp: Factory.build('desiredLrp')}, jasmine.createSpy('callback'));
      subject.setProps({$receptor});
    });

    it('adds the selection class to the page', function() {
      expect('.page').toHaveClass('selection');
    });

    it('does not have a scrim', function() {
      expect('.scrim').not.toExist();
    });
  });

  describe('event stream', function() {
    describe('for actual lrps', function() {
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

      describe('conflict resolution', function() {
        describe('when a actual lrp is changed but does not exist', function() {
          var actualLrp;
          beforeEach(function() {
            actualLrp = Factory.build('actualLrp');
            mockEventSource.trigger('actual_lrp_changed', {
              actual_lrp_before: actualLrps,
              actual_lrp_after: actualLrp
            });
          });
          it('updates the receptor with the new lrp', function() {
            expect(callbackSpy).toHaveBeenCalled();
            expect(callbackSpy.calls.mostRecent().args[0].actualLrps).toHaveLength(3);
            expect(callbackSpy.calls.mostRecent().args[0].actualLrps).toContain(actualLrp);
          });
        });
        describe('when an actual lrp is removed but does not exist', function() {
          beforeEach(function() {
            mockEventSource.trigger('actual_lrp_removed', {
              actual_lrp: Factory.build('actualLrp')
            });
          });

          it('does not update the receptor', function() {
            expect(callbackSpy).not.toHaveBeenCalled();
          });
        });
        describe('when an actual lrp is created but it already exists', function() {
          beforeEach(function() {
            mockEventSource.trigger('actual_lrp_created', {
              actual_lrp: actualLrps[0]
            });
          });
          it('does not update the receptor', function() {
            expect(callbackSpy).not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('for desired lrps', function() {
      describe('when an desired_lrp change event is received', function() {
        beforeEach(function() {
          mockEventSource.trigger('desired_lrp_changed', {
            desired_lrp_before: desiredLrps[1],
            desired_lrp_after: Object.assign({}, desiredLrps[1], {disk_mb: 9999})
          });
        });
        it('updates the receptor with the new lrp', function() {
          expect(callbackSpy).toHaveBeenCalled();
          expect(callbackSpy.calls.mostRecent().args[0].desiredLrps[1].disk_mb).toEqual(9999);
        });
      });

      describe('when an desired_lrp created event is received', function() {
        var desiredLrp;
        beforeEach(function() {
          desiredLrp = Factory.build('desiredLrp');
          mockEventSource.trigger('desired_lrp_created', {
            desired_lrp: desiredLrp
          });
        });
        it('adds the desired lrp to the receptor', function() {
          expect(callbackSpy).toHaveBeenCalled();
          expect(callbackSpy.calls.mostRecent().args[0].desiredLrps).toContain(desiredLrp);
        });
      });

      describe('when an desired_lrp removed event is received', function() {
        beforeEach(function() {
          mockEventSource.trigger('desired_lrp_removed', {
            desired_lrp: desiredLrps[1]
          });
        });

        it('removes the desired lrp from the receptor', function() {
          expect(callbackSpy).toHaveBeenCalled();
          expect(callbackSpy.calls.mostRecent().args[0].desiredLrps).not.toContain(desiredLrps[1]);
        });
      });

    });
  });
});
