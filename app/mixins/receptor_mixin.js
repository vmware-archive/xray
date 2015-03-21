const CELL_POLL_INTERVAL = 10000;
const RECEPTOR_POLL_INTERVAL = 30000;

var ReceptorApi = require('../api/receptor_api');
var CellsApi = require('../api/cells_api');
var sortedIndex = require('lodash.sortedindex');
var {actualLrpIndex, decorateDesiredLrp} = require('../helpers/lrp_helper');
var {diff} = require('../helpers/array_helper');
var {setCorrectingInterval} = require('correcting-interval');
var groupBy = require('lodash.groupby');

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
    $set: newArr.reduce((memo, obj) => (memo[obj[id]] = obj, memo), {})
  };
}

function setIndexArray(newArr, id) {
  return {
    $set: groupBy(newArr, id)
  };
}

var ReceptorMixin = {
  statics: {
    CELL_POLL_INTERVAL,
    RECEPTOR_POLL_INTERVAL
  },

  propTypes: {
    $receptor: types.object.isRequired
  },

  async updateReceptor() {
    var {actualLrps, cells, desiredLrps} = await ReceptorApi.fetch();
    var {$receptor} = this.props;
    desiredLrps.forEach(decorateDesiredLrp.bind(this));

    var change = (a, b) => a.modification_tag.index < b.modification_tag.index;
    var updateDesiredLrps = applyUpdate(desiredLrps, 'process_guid', {change}).$apply;
    var newDesiredLrps = updateDesiredLrps($receptor.get('desiredLrps'));

    var newActualLrps = applyUpdate(actualLrps, 'instance_guid', {change, sortBy: actualLrpIndex})
      .$apply($receptor.get('actualLrps'));

    $receptor.update({
      cells: applyUpdate(cells, 'cell_id', {sortBy: 'cell_id'}),
      actualLrps: {$set: newActualLrps},
      desiredLrps: {$set: newDesiredLrps},
      desiredLrpsByProcessGuid: setIndex(newDesiredLrps, 'process_guid'),
      actualLrpsByProcessGuid: setIndexArray(newActualLrps, 'process_guid'),
      actualLrpsByCellId: setIndexArray(newActualLrps, 'cell_id')
    });
  },

  async updateCells() {
    var {cells} = await CellsApi.fetch();
    var {$receptor} = this.props;
    $receptor.refine('cells').update(applyUpdate(cells, 'cell_id'));
  },

  pollReceptor() {
    setCorrectingInterval(this.updateCells, CELL_POLL_INTERVAL);
    setCorrectingInterval(this.updateReceptor, RECEPTOR_POLL_INTERVAL);
  }
};

module.exports = ReceptorMixin;