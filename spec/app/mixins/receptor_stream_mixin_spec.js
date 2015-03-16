require('../spec_helper');

describe('ReceptorStreamMixin', function() {
  const receptorUrl = 'http://example.com';
  var subject, callbackSpy;

  beforeEach(function() {
    var ReceptorStreamMixin = require('../../../app/mixins/receptor_stream_mixin');
    var Klass = React.createClass({
      mixins: [ReceptorStreamMixin],
      render() { return null; }
    });
    callbackSpy = jasmine.createSpy('callback');
    var Cursor = require('../../../app/lib/cursor');
    var actualLrp = Factory.build('actualLrp', {process_guid: 'xyz', index: 1});
    var $receptor = new Cursor({cells: [], desiredLrps: [], actualLrps: [actualLrp]}, callbackSpy);
    subject = React.render(<Klass {...{$receptor}}/>, root);
    subject.createSSE(receptorUrl);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('#streamActualLrps', function() {
    beforeEach(function() {
      subject.streamActualLrps();
    });
    describe('when actual_lrp created events are received', function() {
      var actualLrp;
      beforeEach(function() {
        actualLrp = Factory.build('actualLrp', {process_guid: 'abc', index: 1});
        MockEventSource.mostRecent().trigger('actual_lrp_created', {
          actual_lrp: actualLrp
        });
      });

      it('adds the actual lrp to the receptor', function() {
        expect(callbackSpy).toHaveBeenCalled();
        var actualLrps = callbackSpy.calls.mostRecent().args[0].actualLrps;
        expect(actualLrps.map(({process_guid, index}) => ({process_guid, index}))).toEqual([
          {process_guid: 'abc', index: 1},
          {process_guid: 'xyz', index: 1}
        ]);
      });
    });
  });
});