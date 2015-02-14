var Factory = require('rosie').Factory;
Factory.define('modificationTag')
  .sequence('epoch', i => i.toString())
  .sequence('index');