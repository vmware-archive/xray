var callbacks = {};
function MockEventSource() {
  return {
    trigger(eventName, data) {
      callbacks[eventName] && callbacks[eventName].forEach(function(cb) {
        cb({data: typeof data === 'object' ? JSON.stringify(data) : data});
      });
    },

    addEventListener(eventName, callback) {
      callbacks[eventName] = callbacks[eventName] || [];
      callbacks[eventName].push(callback);
    },

    removeEventListener(eventName, callback) {
      callbacks[eventName] = callbacks[eventName] || [];
      var index = callbacks[eventName].indexOf(callback);
      if (index !== -1) {
        callbacks[eventName].splice(index, 1);
      }
    }
  }
}

var oldEventSource;
module.exports = Object.assign({}, {
  install() {
    if (oldEventSource) {
      throw new Error('MockEventSource is already installed!');
    }
    oldEventSource = global.EventSource;
    global.EventSource = MockEventSource;
  },

  uninstall() {
    global.EventSource = oldEventSource;
    oldEventSource = null;
  }
}, MockEventSource());