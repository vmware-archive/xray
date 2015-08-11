var raf = (typeof document !== 'undefined') ? require('raf') : null;
var React = require('react');
var ReactSlider = require('react-slider');
var SliderEventMarkers = require('./slider_event_markers');
var moment = require('moment');

var types = React.PropTypes;

var privates = new WeakMap();

var Slider = React.createClass({

  propTypes: {
    eventTimes: types.array,
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

  getInitialState() {
    return {frozen: false}
  },

  shouldComponentUpdate() {
    return !this.state.frozen
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

  mouseLeave() {
    var {$slider} = this.props;
    $slider.merge({hoverTime: null, hoverPercentage: null});
    this.setState({frozen: false});
  },

  mouseEnter() {
    this.setState({frozen: true});
  },

  render() {
    if (!raf) return null;

    var {eventTimes, $slider} = this.props;
    var {frozen} = this.state;
    var {currentTime, beginningOfTime} = $slider.get();
    var now = Date.now();

    if(currentTime === 'now') {
      currentTime = now;
    }

    var rafHandle;
    if(!frozen) {
      var {rafHandle} = privates.get(this);
      raf.cancel(rafHandle);
      rafHandle = raf(() => {this.isMounted() && this.forceUpdate()});
    }

    privates.set(this, {now, rafHandle});

    return (
      <div className="slider-wrapper">
        <div onMouseMove={this.mouseMove} onMouseLeave={this.mouseLeave} onMouseEnter={this.mouseEnter}>
          <SliderEventMarkers beginningOfTime={beginningOfTime} now={now} eventTimes={eventTimes}/>
          <ReactSlider max={now} min={beginningOfTime} onChange={this.change} value={currentTime}/>
        </div>
        <div className="now">{moment(new Date(now)).format('LTS')}</div>
        <div className="beginning-of-time">{moment(new Date(beginningOfTime)).format('LTS')}</div>
      </div>
    );
  }
});

module.exports = Slider;