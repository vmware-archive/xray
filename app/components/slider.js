var React = require('react');
var ReactSlider = require('react-slider');

var types = React.PropTypes;

var Slider = React.createClass({

  propTypes: {
    $currentTime: types.object.isRequired
  },

  change(value) {
    var {$currentTime} = this.props;
    $currentTime.set(value);
  },

  getInitialState() {
    return {
      min: Date.now()
    }
  },

  render() {
    var {$currentTime} = this.props;
    var now = Date.now();
    var value = $currentTime.get();

    var {min} = this.state;

    if(value === 'now') {
      value = Date.now();
    }

    return (
      <ReactSlider max={now} min={min} onChange={this.change} value={value}/>
    );
  }
});

module.exports = Slider;