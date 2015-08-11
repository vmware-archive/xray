var raf = (typeof document !== 'undefined') ? require('raf') : null;
var React = require('react');
var ReactSlider = require('react-slider');

var types = React.PropTypes;

var privates = new WeakMap();

var Slider = React.createClass({

  propTypes: {
    $currentTime: types.object.isRequired
  },

  change(value) {
    var {$currentTime} = this.props;
    var {now} = privates.get(this);
    if(value === now) {
      value = 'now';
    }
    $currentTime.set(value);
  },

  getInitialState() {
    privates.set(this, {now: Date.now()});
    return {
      min: Date.now()
    }
  },

  render() {
    var {$currentTime} = this.props;
    var value = $currentTime.get();
    var {min} = this.state;
    var now = Date.now();
    min = Math.min(min, now - 5 * 60 * 1000);

    var rafHandle;

    if(value === 'now') {
      value = now;
    } else {
      var {rafHandle} = privates.get(this);
      raf.cancel(rafHandle);
      rafHandle = raf(() => {this.isMounted() && this.forceUpdate()});
    }

    privates.set(this, {now, rafHandle});

    return (
      <ReactSlider max={now} min={min} onChange={this.change} value={value}/>
    );
  }
});

module.exports = Slider;