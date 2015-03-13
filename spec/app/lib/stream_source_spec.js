require('../spec_helper');

describe('StreamSource', function() {
  const URL = 'http://user:password@foo.com';
  var StreamSource, subject;
  beforeEach(function() {
    StreamSource = require('../../../app/lib/stream_source');
    subject = new StreamSource(URL, {json: false});
  });

  afterEach(function() {
    subject.close();
    subject.off();
  });

  it('calls the event source without the username and password in the url (firefox)', function() {
    expect(MockEventSource.mostRecent().url).toEqual('http://foo.com');
  });

  describe('when the json option is true', function() {
    it('parses the event as json', function() {
      subject.close();
      subject = new StreamSource(URL, {json: true});
      var onSpy = jasmine.createSpy('on');
      subject.on('eventName', onSpy);
      MockEventSource.mostRecent().trigger('eventName', '{"one": "two"}');
      expect(onSpy).toHaveBeenCalledWith({one: 'two'});
    });
  });

  describe('#on', function() {
    var onSpy;
    beforeEach(function() {
      onSpy = jasmine.createSpy('on');
      subject.on('eventName', onSpy);
    });
    it('listens for the appropriately named message', function() {
      MockEventSource.mostRecent().trigger('eventName', 'data');
      expect(onSpy).toHaveBeenCalledWith(jasmine.objectContaining({data: 'data'}));
    });

    it('ignores other messages', function() {
      MockEventSource.mostRecent().trigger('notMyEventName', 'data');
      expect(onSpy).not.toHaveBeenCalled();
    });
  });

  describe('#off', function() {
    var onSpy;
    beforeEach(function() {
      onSpy = jasmine.createSpy('on');
      subject.on('eventName', onSpy);
    });

    it('does not turn off events for other names', function() {
      subject.off('notMyEventName', onSpy);
      MockEventSource.mostRecent().trigger('eventName', 'data');
      expect(onSpy).toHaveBeenCalled();
    });

    describe('when it has a callback', function() {
      it('turns off events for that name and callback', function() {
        subject.off('eventName', onSpy);
        MockEventSource.mostRecent().trigger('eventName', 'data');
        expect(onSpy).not.toHaveBeenCalled();
      });
    });

    describe('when it has no callback', function() {
      it('turns off all events for that name', function() {
        subject.off('eventName');
        MockEventSource.mostRecent().trigger('eventName', 'data');
        expect(onSpy).not.toHaveBeenCalled();
      });
    });

    describe('when it has no event name or callback', function() {
      it('turns off all events', function() {
        subject.off();
        MockEventSource.mostRecent().trigger('eventName', 'data');
        expect(onSpy).not.toHaveBeenCalled();
      });
    });
  });

  describe('#connected', function() {
    describe('when the stream source is not open', function() {
      it('does not resolve the promise', function() {
        var doneSpy = jasmine.createSpy('done');
        subject.connected().then(doneSpy);
        expect(doneSpy).not.toHaveBeenCalled();
      });
    });

    describe('when the stream source is open', function() {
      it('resolves the promise', function() {
        var doneSpy = jasmine.createSpy('done');
        subject.connected().then(doneSpy);
        MockEventSource.mostRecent().trigger('open');
        MockPromises.executeForResolvedPromises();
        MockPromises.executeForResolvedPromises();
        expect(doneSpy).toHaveBeenCalled();
      });
    });
  });
});
