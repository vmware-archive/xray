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

  mouseMove(e) {
    var {left, right} = React.findDOMNode(this).getBoundingClientRect();
    var hoverPercentage = (e.clientX - left) / (right - left);
    var {$slider} = this.props;
    var {beginningOfTime} = $slider.get();
    var {now} = privates.get(this);
    var hoverTime = hoverPercentage * (now - beginningOfTime) + beginningOfTime;
    $slider.merge({hoverTime, hoverPercentage});
  },

  mouseLeave(e){
    var {$slider} = this.props;
    $slider.merge({hoverTime: null, hoverPercentage: null});
  },

  render() {
    var {$slider} = this.props;
    var {currentTime, beginningOfTime} = $slider.get();
    var now = Date.now();
    //beginningOfTime = Math.min(beginningOfTime, now - 5 * 60 * 1000);

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
      <div onMouseMove={this.mouseMove} onMouseLeave={this.mouseLeave}>
        <ReactSlider max={now} min={beginningOfTime} onChange={this.change} value={currentTime}/>
      </div>
    );
  }
});

module.exports = Slider;