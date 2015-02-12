var React = require('react/addons');
var Cell = require('./cell');
var FastMixin = require('../mixins/fast_mixin');
var sortBy = require('lodash.sortby');

var cx = React.addons.classSet;

var types = React.PropTypes;

var Cells = React.createClass({
  mixins: [FastMixin],

  propTypes: {
    cells: types.array,
    $receptor: types.object
  },

  render() {
    var {cells, $receptor} = this.props;
    cells = cells && sortBy(cells, c => c.cell_id).map(function(cell, i) {
      var key = cell.cell_id;
      var actualLrps = ($receptor.get('actualLrps') || []).filter(lrp => lrp.cell_id === key);
      var odd = i % 2;
      var props = {className: cx({'bg-dark-1': odd, 'bg-dark-2': !odd}), actualLrps, cell, $receptor, key};
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