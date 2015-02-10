var Factory = require('rosie').Factory;
Factory.define('cell')
  .sequence('cell_id')
  .sequence('zone')
  .attr('capacity', {containers: 256, disk_mb: 5024, memory_mb: 1024});