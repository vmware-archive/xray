var React = require('react');

var types = React.PropTypes;

var Cells = React.createClass({
  propTypes: {
    cells: types.array
  },

  render() {
    var {cells} = this.props;
    cells = cells && cells.map(function({cell_id: cellId}) {
      return (<li className="cell" key={cellId}>{cellId}</li>);
    });

    return (
      <ul>{cells}</ul>
    );
  }
});

module.exports = Cells;