var React = require('react/addons');
var Cell = require('./cell');
var sortBy = require('lodash.sortby');

var types = React.PropTypes;

var Cells = React.createClass({
  //mixins: [require('../mixins/fast_mixin')],

  propTypes: {
    cells: types.array
  },

  render() {
    var {cells} = this.props;
    cells = cells && sortBy(cells, c => c.cell_id).map(function(cell) {
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