var React = require('react/addons');
var jQuery = require('jquery');

(function($) {
  $.fn.simulate = function(eventName, ...args) {
    if (!this.length) {
      throw new Error(`jQuery Simulate has an empty selection for '${this.selector}'`);
    }
    $.each(this, function() {
      if (['mouseOver', 'mouseOut'].includes(eventName)) {
        React.addons.TestUtils.SimulateNative[eventName](this, ...args);
      } else {
        React.addons.TestUtils.Simulate[eventName](this, ...args);
      }
    });
    return this;
  };
})(jQuery);

module.exports = {
  withContext(context, props, callback, root) {
    if (arguments.length === 3) {
      root = callback;
      callback = props;
      props = {};
    }

    var childContextTypes = Object.keys(context).reduce((memo, key) => (memo[key] = React.PropTypes.any, memo), {});
    var Context = React.createClass({
      childContextTypes,
      getChildContext() { return context; },
      render() {
        return (<div>{callback.call(this)}</div>);
      }
    });

    return React.render(<Context {...props}/>, root);
  }
};