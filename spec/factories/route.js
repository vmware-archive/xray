var Factory = require('rosie').Factory;
var faker = require('faker');
Factory.define('route')
  .attr('hostnames', () => [faker.internet.domainName()])
  .attr('port', 8080);