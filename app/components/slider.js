var raf = (typeof document !== 'undefined') ? require('raf') : null;
var React = require('react');
var ReactSlider = require('react-slider');

var types = React.PropTypes;

var privates = new WeakMap();

var Slider = React.createClass({

  propTypes: {
    $slider: types.object.isRequired
  },

  change(value) {
    var {$slider} = this.props;
    var {now} = privates.get(this);
    if(value === now) {
      value = 'now';
    }
    $slider.refine('currentTime').set(value);
  },

  componentWillMount() {
    privates.set(this, {now: Date.now()});
  },

  render() {
    var {$slider} = this.props;
    var {currentTime, beginningOfTime} = $slider.get();
    var now = Date.now();
    beginningOfTime = Math.min(beginningOfTime, now - 5 * 60 * 1000);

    var rafHandle;

    if(currentTime === 'now') {
      currentTime = now;
    } else {
      var {rafHandle} = privates.get(this);
      raf.cancel(rafHandle);
      rafHandle = raf(() => {this.isMounted() && this.forceUpdate()});
    }

    privates.set(this, {now, rafHandle});

    return (
      <ReactSlider max={now} min={beginningOfTime} onChange={this.change} value={currentTime}/>
    );
  }
});

module.exports = Slider;