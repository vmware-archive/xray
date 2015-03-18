var Cells = require('./cells');
var PureRenderMixin = require('../mixins/pure_render_mixin');
var React = require('react/addons');

var types = React.PropTypes;

var Zones = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    $receptor: types.object,
    scaling: types.string.isRequired,
    $selection: types.object,
    $sidebar: types.object
  },

  renderZones: function() {
    var {scaling, $receptor, $selection, $sidebar} = this.props;
    var cells = $receptor.get('cells');
    if (!cells) return null;

    var zones = cells.reduce(function(zones, cell){
      var zone = zones[cell.zone] || [];
      zone.push(cell);
      zones[cell.zone] = zone;
      return zones;
    }, {});

    return Object.keys(zones).sort().map(function(zone) {
      var cells = this[zone];
      return (
        <div className="zone" key={zone}>
          <header><h3 className="em-high">{`Zone ${zone} - ${cells.length} Cells`}</h3></header>
          <Cells {...{cells, scaling, $receptor, $selection, $sidebar}}/>
        </div>
      );
    }, zones);
  },

  render() {
    return (
      <div className="zones">
        {this.renderZones()}
      </div>
    );
  }
});

module.exports = Zones;