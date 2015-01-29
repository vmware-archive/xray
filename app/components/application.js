require('6to5/polyfill');
var React = require('react');
var Layout = require('../../server/components/layout');

var types = React.PropTypes;

var Application = React.createClass({
  propTypes: {
    receptorUrl: types.string
  },

  render() {
    return (
      <div>{this.props.receptorUrl}</div>
    );
  }
});

Layout.init(Application, {receptorUrl: 'http://receptor.192.168.11.11.xip.io/'});

module.exports = Application;