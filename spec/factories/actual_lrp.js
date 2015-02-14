var Factory = require('rosie').Factory;
Factory.define('actualLrp')
  .sequence('process_guid', i => i.toString())
  .sequence('instance_guid', i => i.toString())
  .sequence('cell_id')
  .sequence('index')
  .attr('modification_tag', () => Factory.build('modificationTag'))
  .attr('state', 'RUNNING');