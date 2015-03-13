var React = require('react/addons');
var Cell = require('./cell');
var PureRenderMixin = require('../mixins/pure_render_mixin');
var sortBy = require('lodash.sortby');

var types = React.PropTypes;

var Cells = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    cells: types.array,
    $receptor: types.object
  },

  render() {
    var {cells, $receptor} = this.props;
    cells = cells && sortBy(cells, c => c.cell_id).map(function(cell) {
      var key = cell.cell_id;
      var actualLrps = ($receptor.get('actualLrps') || []).filter(lrp => lrp.cell_id === key);
      var props = {actualLrps, cell, $receptor, key};
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