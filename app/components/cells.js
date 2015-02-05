var React = require('react/addons');
var Cell = require('./cell');
var {sortBy} = require('../helpers/array_helper');

var types = React.PropTypes;

var Cells = React.createClass({
  //mixins: [require('../mixins/fast_mixin')],

  propTypes: {
    cells: types.array
  },

  render() {
    var {cells} = this.props;
    cells = cells && sortBy(cells, 'cell_id').map(function(cell) {
      return (<Cell cell={cell} key={cell.cell_id}/>);
    });

    return (
      <div className="cells">
        <ul>{cells}</ul>
      </div>
    );
  }
});

module.exports = Cells;