var requireDir = require('require-dir');
requireDir('../../spec/factories');
var Factory = require('rosie').Factory;

var times = require('lodash.times');
var flatten = require('lodash.flatten');

const MAX_MEMORY = 8192;
const MIN_MEMORY = 512;

function instanceCount() {
  return Math.floor(Math.random() * (15 - 2)) + 2;
}

function memory_mb() {
  return Math.floor(Math.random() * (MAX_MEMORY - MIN_MEMORY) + MIN_MEMORY);
}

function running_time() {
  var max = 5 * 24 * 60 * 60;
  var min = 10;
  return 1000 * Math.floor(Math.random() * (max - min) + min);
}

function fakeApi({cellCount, desiredLrpsCount}) {
  function cellNo() {
    return Math.floor(Math.random() * (cellCount));
  }

  var cells = times(cellCount).map(
      t => Factory.build('cell', {
      zone: 'zone_west',
      capacity: { containers: 256, disk_mb: 555555, memory_mb: MAX_MEMORY * 8 },
      cell_id: `cell_${t}`
    })
  );
  var desiredLrps = times(desiredLrpsCount).map(
      t => Factory.build('desiredLrp', {
        process_guid: `process_guid_${t}`,
        instances: instanceCount(),
        memory_mb: memory_mb()
      })
  );
  var actualLrps = flatten(desiredLrps.map(
      desiredLrp => times(desiredLrp.instances).map(
        t => Factory.build('actualLrp', {
        cell_id: cells[cellNo()].cell_id,
        process_guid: desiredLrp.process_guid,
        index: t,
        since: (Date.now() - running_time()) * 1000000
      })
    )
  ));

  function cellsIndex(req, res) {
    res.status(200).type('json').send(cells);
  }

  function actualLrpsIndex(req, res) {
    res.status(200).type('json').send(actualLrps);
  }

  function desiredLrpsIndex(req, res) {
    res.status(200).type('json').send(desiredLrps);
  }
  return {
    cells: {index: cellsIndex},
    actualLrps: {index: actualLrpsIndex},
    desiredLrps: {index: desiredLrpsIndex}
  };
}

var demo = fakeApi({cellCount: 12, desiredLrpsCount: 15});
var perf = fakeApi({cellCount: 12, desiredLrpsCount: 100});

module.exports = {demo, perf};