var ReceptorApi = require('../api/receptor_api');
var CellsApi = require('../api/cells_api');
var {diff} = require('../helpers/array_helper');
var {setCorrectingInterval} = require('correcting-interval');
const CELL_POLL_INTERVAL = 10000;
const RECEPTOR_POLL_INTERVAL = 120000;

function applyUpdate(newArr, id, changeCallback) {
  return {
    $apply: function(oldArr) {
      var {added, removed, changed} = diff(oldArr, newArr, id, changeCallback);
      var results = oldArr.filter(x => !removed.includes(x));
      if (changed && changed.length) {
        /* jshint unused:false */
        var currentChanged = changed.map(([current, next]) => current);
        var nextChanged = changed.map(([current, next]) => next);
        /* jshint unused:true */
        results = results.map(x => currentChanged.includes(x) ? nextChanged[currentChanged.indexOf(x)] : x);
      }
      return results.concat(added);
    }
  };
}

var ReceptorMixin = {
  statics: {
    CELL_POLL_INTERVAL: 10000,
    RECEPTOR_POLL_INTERVAL: 120000
  },

  updateReceptor() {
    var {$receptor} = this.props;
    return ReceptorApi.fetch()
      .then(function({actualLrps, cells, desiredLrps}) {
        $receptor.update({
          cells: applyUpdate(cells, 'cell_id'),
          actualLrps: applyUpdate(actualLrps, 'instance_guid', (a, b) => a.since !== b.since),
          desiredLrps: applyUpdate(desiredLrps, 'process_guid')
        });
      })
      .catch(reason => console.error('Receptor Promise failed because', reason));
  },

  updateCells() {
    var {$receptor} = this.props;
    return CellsApi.fetch()
      .then(function({cells}) {
        $receptor.refine('cells').update(applyUpdate(cells, 'cell_id'));
      })
      .catch(reason => console.error('Cells Promise failed because', reason));
  },

  pollReceptor() {
    setCorrectingInterval(this.updateCells, CELL_POLL_INTERVAL);
    setCorrectingInterval(this.updateReceptor, RECEPTOR_POLL_INTERVAL);
  }
};

module.exports = ReceptorMixin;