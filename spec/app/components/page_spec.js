require('../spec_helper');

describe('Page', function() {
  var Zones, Scaling, Sidebar, subject, $receptor, $sidebar, $selection, Cursor, actualLrps, desiredLrps, callbackSpy;

  beforeEach(function() {
    Zones = require('../../../app/components/zones');
    Scaling = require('../../../app/components/scaling');
    Sidebar = require('../../../app/components/sidebar');

    spyOn(Zones.prototype, 'render').and.callThrough();
    spyOn(Scaling.prototype, 'render').and.callThrough();
    spyOn(Sidebar.prototype, 'render').and.callThrough();

    var AuthorizationApi = require('../../../app/api/authorization_api');
    spyOn(AuthorizationApi, 'create').and.returnValue(Promise.resolve());

    Cursor = require('pui-cursor');
    var Page = require('../../../app/components/page');
    actualLrps = [
      Factory.build('actualLrp', {cell_id: 'android16', process_guid: 'one'}),
      Factory.build('actualLrp', {cell_id: 'android17', instance_guid: null, process_guid: 'two', modification_tag: {epoch: 2, index: 1}})
    ];
    desiredLrps = Factory.buildList('desiredLrp', 2);

    var colors = ['#fff', '#000'];

    $selection = new Cursor({}, jasmine.createSpy('callback'));
    $sidebar = new Cursor({}, jasmine.createSpy('callback'));
    var $scaling = new Cursor('containers', jasmine.createSpy('callback'));
    callbackSpy = jasmine.createSpy('callback');
    var actualLrpsByProcessGuid = {one: [actualLrps[0]], two: [actualLrps[1]]};
    var actualLrpsByCellId = {android16: [actualLrps[0]], android17: [actualLrps[1]]};
    var selectedReceptor = {
      actualLrps,
      desiredLrps,
      desiredLrpsByProcessGuid: {},
      actualLrpsByProcessGuid,
      actualLrpsByCellId
    };

    $receptor = new Cursor(selectedReceptor, callbackSpy);
    var $slider = new Cursor({currentTime: 'now'}, jasmine.createSpy('callback'));
    var $modal = new Cursor(null, jasmine.createSpy('modalCallback'));
    var receptorUrl = 'http://examples.com';
    var props = {selectedReceptor, receptorUrl, $modal, $receptor, $scaling, $sidebar, $selection, $slider};
    subject = withContext(
      {scaling: 'containers', colors},
      props,
      function() {
        return (<Page {...this.props}/>);
      },
      root
    );
    MockPromises.executeForResolvedPromises();
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('when the selected receptor is not the same as the receptor cursor', function() {
    var selectedReceptor;
    beforeEach(function() {
      var actualLrps = [
        Factory.build('actualLrp', {cell_id: 'android16', process_guid: 'one'}),
        Factory.build('actualLrp', {cell_id: 'android17', instance_guid: null, process_guid: 'two', modification_tag: {epoch: 2, index: 1}})
      ];
      var desiredLrps = Factory.buildList('desiredLrp', 2);

      var actualLrpsByProcessGuid = {one: [actualLrps[0]], two: [actualLrps[1]]};
      var actualLrpsByCellId = {android16: [actualLrps[0]], android17: [actualLrps[1]]};
      selectedReceptor = {
        actualLrps,
        desiredLrps,
        desiredLrpsByProcessGuid: {},
        actualLrpsByProcessGuid,
        actualLrpsByCellId
      };

      subject.setProps({selectedReceptor});
    });

    it('renders a different receptor cursor', function() {
      var cursors = [Zones, Scaling, Sidebar].map(klass => {
        return klass.prototype.render.calls.mostRecent().object.props.$receptor;
      });
      cursors.forEach(cursor => {
        expect(cursor.isEqual($receptor)).toBe(false);
        expect(cursor.get()).toEqual(selectedReceptor);
      });
    });
  });

  describe('when there is a selected lrp', function() {
    var selectedDesiredLrpCallbackSpy;
    var desiredLrp;
    beforeEach(function() {
      selectedDesiredLrpCallbackSpy = jasmine.createSpy('callback');
      desiredLrp = Factory.build('desiredLrp');
      $selection = new Cursor({selectedDesiredLrp: desiredLrp, hoverDesiredLrp: desiredLrp}, selectedDesiredLrpCallbackSpy);
      subject.setProps({$selection});
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
    var desiredLrp;

    beforeEach(function() {
      desiredLrp = Factory.build('desiredLrp');
      $selection = new Cursor({hoverDesiredLrp: desiredLrp}, jasmine.createSpy('callback'));
      subject.setProps({$selection});
    });

    it('adds the selection class to the page', function() {
      expect('.page').toHaveClass('selection');
    });

    it('does not have a scrim', function() {
      expect('.scrim').not.toExist();
    });
  });

  describe('when a desiredLrp is filtered', function() {
    beforeEach(function() {
      var desiredLrps = [Factory.build('desiredLrp'), Factory.build('desiredLrp')];
      $selection = new Cursor({filteredLrps: desiredLrps}, jasmine.createSpy('callback'));
      $sidebar = new Cursor({filter: 'foo'}, jasmine.createSpy('callback'));
      subject.setProps({$selection, $sidebar});
    });

    it('adds the selection class to the page', function() {
      expect('.page').toHaveClass('selection');
    });
  });

  describe('when the sidebar is collapsed ', function() {
    beforeEach(function() {
      $sidebar = new Cursor({sidebarCollapsed: true}, jasmine.createSpy('callback'));
      subject.setProps({$sidebar});
    });

    it('adds the sidebar collapsed class to the page', function() {
      expect('.page').toHaveClass('sidebar-collapsed');
    });
  });

  describe('event stream', function() {
    describe('for actual lrps', function() {
      describe('when an actual_lrp change event is received', function() {
        beforeEach(function() {
          MockEventSource.mostRecent().trigger('actual_lrp_changed', {
            actual_lrp_before: actualLrps[1],
            actual_lrp_after: Object.assign({}, actualLrps[1], {state: 'CLAIMED', instance_guid: '123', modification_tag: {epoch: 2, index: 2}})
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
          MockEventSource.mostRecent().trigger('actual_lrp_created', {
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
          MockEventSource.mostRecent().trigger('actual_lrp_removed', {
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
            MockEventSource.mostRecent().trigger('actual_lrp_changed', {
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
            MockEventSource.mostRecent().trigger('actual_lrp_removed', {
              actual_lrp: Factory.build('actualLrp')
            });
          });

          it('does not update the receptor', function() {
            expect(callbackSpy).not.toHaveBeenCalled();
          });
        });
        describe('when an actual lrp is created but it already exists', function() {
          beforeEach(function() {
            MockEventSource.mostRecent().trigger('actual_lrp_created', {
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
          MockEventSource.mostRecent().trigger('desired_lrp_changed', {
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
          desiredLrp = Factory.build('desiredLrp', {}, {raw: true});
          MockEventSource.mostRecent().trigger('desired_lrp_created', {
            desired_lrp: desiredLrp
          });
        });
        it('adds the desired lrp to the receptor', function() {
          expect(callbackSpy).toHaveBeenCalled();
          expect(callbackSpy.calls.mostRecent().args[0].desiredLrps).toContain(jasmine.objectContaining(desiredLrp));
        });
      });

      describe('when an desired_lrp removed event is received', function() {
        beforeEach(function() {
          MockEventSource.mostRecent().trigger('desired_lrp_removed', {
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
