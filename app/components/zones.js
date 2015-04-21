var Cells = require('./cells');
var PureRenderMixin = require('pui-cursor/mixins/pure-render-mixin');
var React = require('react/addons');
var groupBy = require('lodash.groupby');

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

    var zones = groupBy(cells, 'zone');
    return Object.keys(zones).sort().map(function(zone) {
      var cells = zones[zone];
      return (
        <div className="zone" key={zone}>
          <header><h3 className="em-high">{`Zone ${zone} - ${cells.length} Cells`}</h3></header>
          <Cells {...{cells, scaling, $receptor, $selection, $sidebar}}/>
        </div>
      );
    });
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