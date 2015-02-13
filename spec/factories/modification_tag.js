var Factory = require('rosie').Factory;
Factory.define('modificationTag')
  .sequence('epoch')
  .sequence('index');