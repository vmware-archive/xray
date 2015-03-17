var requireDir = require('require-dir');
requireDir('../../spec/factories');
var Factory = require('rosie').Factory;

var times = require('lodash.times');
var flatten = require('lodash.flatten');

const CELL_COUNT = 10;
const DESIRED_LRPS_COUNT = 100;
const INSTANCE_COUNT = 20;

var cells = Factory.buildList('cell', CELL_COUNT, {zone: 'zone'});
var desiredLrps = times(DESIRED_LRPS_COUNT).map(t => Factory.build('desiredLrp', {process_guid: t.toString()}));
var actualLrps = flatten(times(DESIRED_LRPS_COUNT).map(t => Factory.buildList('actualLrp', INSTANCE_COUNT, {cell_id: cells[t % CELL_COUNT].cell_id, process_guid: desiredLrps[t].process_guid})));

function cellsIndex(req, res) {
  res.status(200).type('json').send(cells);
}

function actualLrpsIndex(req, res) {
  res.status(200).type('json').send(actualLrps);
}

function desiredLrpsIndex(req, res) {
  res.status(200).type('json').send(desiredLrps);
}

module.exports = {
  v1: {
    cells: {index: cellsIndex},
    actualLrps: {index: actualLrpsIndex},
    desiredLrps: {index: desiredLrpsIndex}
  }
};