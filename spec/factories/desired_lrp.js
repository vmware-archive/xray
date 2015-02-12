var Factory = require('rosie').Factory;
Factory.define('desiredLrp')
  .sequence('process_guid')
  .attr('disk_mb', 1024)
  .attr('memory_mb', 128)
  .attr('instances', 4)
  .attr('routes', function() {
    return {'cf-router': Factory.buildList('route', 3)};
  });