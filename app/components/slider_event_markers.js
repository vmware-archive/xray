var React = require('react');

var types = React.PropTypes;

var SliderEventMarkers = React.createClass({
  propTypes: {
    beginningOfTime: types.number.isRequired,
    now: types.number.isRequired,
    eventTimes: types.array.isRequired
  },

  renderMarkers(){
    var {eventTimes = [], beginningOfTime, now} = this.props;
    var timeRange = now - beginningOfTime;
    return eventTimes.map((time, key) => {
      var xPosition = (time - beginningOfTime) / timeRange;
      return (<div className="event-marker" style={{left: `${xPosition * 100}%`}} key={key}/>);
    });
  },

  render(){
    return (
      <div className="event-markers">
        {this.renderMarkers()}
      </div>
    );
  }
});

module.exports = SliderEventMarkers;