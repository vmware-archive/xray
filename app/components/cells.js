var React = require('react/addons');
var Cell = require('./cell');

var types = React.PropTypes;

var Cells = React.createClass({
  propTypes: {
    cells: types.array
  },

  render() {
    var {cells} = this.props;
    cells = cells && cells.map(function(cell) {
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