require('6to5/polyfill');
var CellsApi = require('../api/cells_api');
var Cells = require('./cells');
var React = require('react');
var Layout = require('../../server/components/layout');

var types = React.PropTypes;

var Application = React.createClass({
  propTypes: {
    receptorUrl: types.string
  },

  getInitialState() {
    return {cells: null};
  },

  componentDidMount() {
    CellsApi.baseUrl = this.props.receptorUrl;
    CellsApi.fetch().then(function({cells}) {
      this.setState({cells});
    }.bind(this));
  },

  render() {
    var {cells} = this.state;
    return (
      <div>
        <div>{this.props.receptorUrl}</div>
        <Cells {...{cells}}/>
      </div>
    );
  }
});

Layout.init(Application, {receptorUrl: 'http://receptor.192.168.11.11.xip.io'});

module.exports = Application;