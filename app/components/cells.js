var React = require('react/addons');
var Cell = require('./cell');
var FastMixin = require('../mixins/fast_mixin');
var sortBy = require('lodash.sortby');

var types = React.PropTypes;

var Cells = React.createClass({
  mixins: [FastMixin],

  propTypes: {
    cells: types.array,
    actualLrps: types.array,
    desiredLrps: types.array
  },

  render() {
    var {cells, desiredLrps} = this.props;
    cells = cells && sortBy(cells, c => c.cell_id).map(function(cell) {
      var key = cell.cell_id;
      var actualLrps = (this.props.actualLrps || []).filter(lrp => lrp.cell_id === key);
      var props = {actualLrps, cell, desiredLrps, key};
      return (<Cell {...props}/>);
    }, this);

    return (
      <div className="cells">
        <ul>{cells}</ul>
      </div>
    );
  }
});

module.exports = Cells;