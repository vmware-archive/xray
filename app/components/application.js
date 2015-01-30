require('6to5/polyfill');
var CellsApi = require('../api/cells_api');
var Cells = require('./cells');
var React = require('react');
var Layout = require('../../server/components/layout');

var types = React.PropTypes;

var Application = React.createClass({
  propTypes: {
    config: types.object.isRequired
  },

  getInitialState() {
    return {cells: null};
  },

  componentDidMount() {
    CellsApi.baseUrl = this.props.config.receptorUrl;
    CellsApi.fetch().then(function({cells}) {
      this.setState({cells});
    }.bind(this));
  },

  render() {
    var {cells} = this.state;
    return (
      <div>
        <div>{this.props.config.receptorUrl}</div>
        <Cells {...{cells}}/>
      </div>
    );
  }
});

Layout.init(Application);

module.exports = Application;