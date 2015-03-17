var Factory = require('rosie').Factory;
Factory.define('desiredLrp')
  .sequence('process_guid', i => i.toString())
  .attr('modification_tag', () => Factory.build('modificationTag'))
  .attr('disk_mb', 1024)
  .attr('memory_mb', 128)
  .attr('instances', 4)
  .attr('routes', function() {
    return {'cf-router': Factory.buildList('route', 3)};
  })
  .attr('filterString', ['process_guid'], function(process_guid) { return process_guid; });