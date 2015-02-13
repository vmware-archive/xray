require('../spec_helper');

describe('StreamSource', function() {
  var subject;
  beforeEach(function() {
    var StreamSource = require('../../../app/lib/stream_source');
    subject = new StreamSource('foo.com');
  });

  describe('on', function() {
    var onSpy;
    beforeEach(function() {
      onSpy = jasmine.createSpy('on');
      subject.on('eventName', onSpy);
    });
    it('listens for the appropriately named message', function() {
      mockEventSource.trigger('eventName', 'data');
      expect(onSpy).toHaveBeenCalledWith(jasmine.objectContaining({data: 'data'}));
    });

    it('ignores other messages', function() {
      mockEventSource.trigger('notMyEventName', 'data');
      expect(onSpy).not.toHaveBeenCalled();
    });
  });

  describe('off', function() {
    var onSpy;
    beforeEach(function() {
      onSpy = jasmine.createSpy('on');
      subject.on('eventName', onSpy);
    });

    it('does not turn off events for other names', function() {
      subject.off('notMyEventName', onSpy);
      mockEventSource.trigger('eventName', 'data');
      expect(onSpy).toHaveBeenCalled();
    });

    describe('when it has a callback', function() {
      it('turns off events for that name and callback', function() {
        subject.off('eventName', onSpy);
        mockEventSource.trigger('eventName', 'data');
        expect(onSpy).not.toHaveBeenCalled();
      });
    });

    describe('when it has no callback', function() {
      it('turns off all events for that name', function() {
        subject.off('eventName');
        mockEventSource.trigger('eventName', 'data');
        expect(onSpy).not.toHaveBeenCalled();
      });
    });

    describe('when it has no event name or callback', function() {
      it('turns off all events', function() {
        subject.off();
        mockEventSource.trigger('eventName', 'data');
        expect(onSpy).not.toHaveBeenCalled();
      });
    });
  });
});
