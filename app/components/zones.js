var React = require('react/addons');
var Cells = require('./cells');

var types = React.PropTypes;

var Zones = React.createClass({
  propTypes: {
    cells: types.array
  },

  render() {
    var {cells} = this.props;
    if (!cells) return null;

    var zones = cells.reduce(function(zones, cell){
      var zone = zones[cell.zone] || [];
      zone.push(cell);
      zones[cell.zone] = zone;
      return zones;
    }, {});

    zones = Object.keys(zones).sort().map(function(zone) {
      var cells = this[zone];
      return (
        <div className="zone" key={zone}>
          <header><h2>{`Zone ${zone} - ${cells.length} Cells`}</h2></header>
          <Cells {...{cells}}/>
        </div>
      );
    }, zones);

    return (<div className="zones">{zones}</div>);
  }
});

module.exports = Zones;