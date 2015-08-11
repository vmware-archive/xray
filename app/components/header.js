var {Flag} = require('pui-react-media');
var {isString} = require('../../helpers/application_helper');
var React = require('react');
var Svg = require('./svg');
var moment = require('moment');

var types = React.PropTypes;

var Header = React.createClass({
  propTypes: {
    $slider: types.object
  },

  renderSlider() {
    var {$slider} = this.props;
    if (!$slider) return null;
    var {currentTime} = $slider.get();
    var time = isString(currentTime) ? 'live' : moment(new Date(currentTime)).format('LTS');
    return (<h1 className="time mlxl">current view | {time}</h1>);
  },

  render() {
    var {className, children} = this.props;
    return (
      <header className={className}>
        <Flag leftImage={<Svg src="logo" className="logo"/>} rightImage={children}>
          <div className="header-content">
            <h1>X-Ray</h1>
            {this.renderSlider()}
          </div>
        </Flag>
      </header>
    );
  }
});

module.exports = Header;