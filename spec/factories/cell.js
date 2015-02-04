var Factory = require('rosie').Factory;
Factory.define('cell')
  .sequence('cell_id')
  .sequence('zone')
  .attr('Capacity', {containers: 256, disk_mb: 5024, memory_mb: 1024})
  .attr('actual_lrps', ['cell_id'], (cellId) => Factory.buildList('actualLrp', 3, {cell_id: cellId}));