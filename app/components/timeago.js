var React = require('react/addons');
var timeago = require('timeago');

timeago.settings.strings = {
  prefixAgo: null,
  prefixFromNow: null,
  suffixAgo: '',
  suffixFromNow: '',
  seconds: '%ds',
  minute: '1m',
  minutes: '%dm',
  hour: '1h',
  hours: '%dh',
  day: '1d',
  days: '%dd',
  month: '1mo',
  months: '%dmo',
  year: '1yr',
  years: '%dyr',
  wordSeparator: ' ',
  numbers: []
};

var types = React.PropTypes;

var Timeago = React.createClass({
  propTypes: {
    dateTime: types.object.isRequired
  },

  render() {
    var {dateTime} = this.props;
    return (<time dateTime={dateTime.toISOString()}>{timeago(dateTime)}</time>);
  }
});

module.exports = Timeago;