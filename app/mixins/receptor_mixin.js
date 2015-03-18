var ReceptorApi = require('../api/receptor_api');
var CellsApi = require('../api/cells_api');
var sortedIndex = require('lodash.sortedindex');
var {actualLrpIndex, decorateDesiredLrp} = require('../helpers/lrp_helper');
var {diff} = require('../helpers/array_helper');
var {setCorrectingInterval} = require('correcting-interval');
const CELL_POLL_INTERVAL = 10000;
const RECEPTOR_POLL_INTERVAL = 120000;

var React = require('react/addons');
var types = React.PropTypes;

function applyUpdate(newArr, id, options = {}) {
  return {
    $apply: function(oldArr) {
      var {added, removed, changed} = diff(oldArr, newArr, id, options.change);
      var results = oldArr.filter(x => !removed.includes(x));
      if (changed && changed.length) {
        /*eslint-disable no-unused-vars*/
        var currentChanged = changed.map(([current, next]) => current);
        var nextChanged = changed.map(([current, next]) => next);
        /*eslint-enable no-unused-vars*/
        results = results.map(x => currentChanged.includes(x) ? nextChanged[currentChanged.indexOf(x)] : x);
      }

      if (options.sortBy) {
        added.forEach(function(obj) {
          var index = sortedIndex(results, obj, options.sortBy);
          results.splice(index, 0, obj);
        });
        return results;
      }
      return results.concat(added);
    }
  };
}

function setIndex(newArr, id) {
  return {
    $apply: function(oldIndex) {
      return newArr.reduce((memo, obj) => (memo[obj[id]] = oldIndex[obj[id]] || obj, memo), {});
    }
  };
}

var ReceptorMixin = {
  statics: {
    CELL_POLL_INTERVAL: 10000,
    RECEPTOR_POLL_INTERVAL: 120000
  },

  propTypes: {
    $receptor: types.object.isRequired
  },

  updateReceptor() {
    var {$receptor} = this.props;
    var self = this;
    return ReceptorApi.fetch()
      .then(function({actualLrps, cells, desiredLrps}) {
        desiredLrps.forEach(decorateDesiredLrp.bind(self));
        $receptor.update({
          cells: applyUpdate(cells, 'cell_id', {sortBy: 'cell_id'}),
          actualLrps: applyUpdate(actualLrps, 'instance_guid', {change: (a, b) => a.since !== b.since, sortBy: actualLrpIndex}),
          desiredLrps: applyUpdate(desiredLrps, 'process_guid'),
          desiredLrpsByProcessGuid: setIndex(desiredLrps, 'process_guid')
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