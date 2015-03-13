var oldEventSource;
var instances = [];

var privates = new WeakMap();
class MockEventSource {
  constructor(url, options = {}) {
    privates.set(this, {url, callbacks: {}, options});
    this.close = jasmine.createSpy('close');
    instances.unshift(this);
  }

  get url() { return privates.get(this).url; }

  close() {}

  trigger(eventName, data) {
    var {callbacks} = privates.get(this);
    callbacks[eventName] && callbacks[eventName].forEach(function(cb) {
      cb({data: typeof data === 'object' ? JSON.stringify(data) : data});
    });
  }

  addEventListener(eventName, callback) {
    var {callbacks} = privates.get(this);
    callbacks[eventName] = callbacks[eventName] || new Set();
    callbacks[eventName].add(callback);
  }

  removeEventListener(eventName, callback) {
    var {callbacks} = privates.get(this);
    callbacks[eventName] = callbacks[eventName] || new Set();
    callbacks[eventName].delete(callback);
  }

  static install() {
    if (oldEventSource) {
      throw new Error('MockEventSource is already installed!');
    }
    oldEventSource = global.EventSource;
    global.EventSource = MockEventSource;
  }

  static uninstall() {
    global.EventSource = oldEventSource;
    oldEventSource = null;
    instances = [];
  }

  static mostRecent() {
    return instances[0];
  }
}

module.exports = MockEventSource;