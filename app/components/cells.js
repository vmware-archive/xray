var React = require('react');
var Cell = require('./cell');
var PureRenderMixin = require('pui-cursor/mixins/pure-render-mixin');

var types = React.PropTypes;

var Cells = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    cells: types.array,
    scaling: types.string.isRequired,
    $receptor: types.object,
    $selection: types.object,
    $sidebar: types.object
  },

  render() {
    var {cells, scaling, $receptor, $selection, $sidebar} = this.props;
    cells = cells && cells.map(function(cell) {
      var key = cell.cell_id;
      var actualLrps = $receptor.get('actualLrpsByCellId', key) || [];
      var props = {actualLrps, cell, scaling, $receptor, $selection, $sidebar, key};
      return (<Cell {...props}/>);
    }, this);

    return (
      <div className="cells">
        <ul className="pan">{cells}</ul>
      </div>
    );
  }
});

module.exports = Cells;