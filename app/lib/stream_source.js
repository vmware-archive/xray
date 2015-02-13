var privates = new WeakMap();

class StreamSource {
  constructor(url, options = {}) {
    var eventSource = new EventSource(url, options);
    privates.set(this, {eventSource, callbacks: {}});
  }

  on(eventName, callback) {
    var {eventSource, callbacks} = privates.get(this);
    callbacks[eventName] = callbacks[eventName] || [];
    callbacks[eventName].push(callback);
    eventSource.addEventListener(eventName, callback, false);
    return this;
  }

  off(eventName, callback) {
    function removeEvent(eventName) {
      callbacks[eventName].forEach(callback => eventSource.removeEventListener(eventName, callback));
      callbacks[eventName] = [];
    }

    var {eventSource, callbacks} = privates.get(this);
    callbacks[eventName] = callbacks[eventName] || [];
    if(callback) {
      eventSource.removeEventListener(eventName, callback);
      var index = callbacks[eventName].indexOf(callback);
      if(index !== -1) { callbacks[eventName].splice(index, 1);}
      return this;
    }
    if(eventName) {
      removeEvent(eventName);
      return this;
    }
    Object.keys(callbacks).forEach(removeEvent);
    return this;
  }
}

module.exports = StreamSource;