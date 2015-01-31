var Factory = require('rosie').Factory;
Factory.define('cell')
  .sequence('cell_id')
  .attr('actual_lrps', ['cell_id'], (cellId) => Factory.buildList('actualLrp', 3, {cell_id: cellId}));