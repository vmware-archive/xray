require('6to5/polyfill');
var BaseApi = require('../api/base_api');
var Layout = require('../../server/components/layout');
var Modal = require('./modal');
var React = require('react/addons');
var ReceptorApi = require('../api/receptor_api');
var ReceptorUrlModal = require('./receptor_url_modal');
var Zones = require('./zones');
var {setCorrectingInterval} = require('correcting-interval');
var {diff} = require('../helpers/array_helper');

var types = React.PropTypes;
var update = React.addons.update;

var Application = React.createClass({
  propTypes: {
    config: types.object.isRequired
  },

  childContextTypes: {
    cells: types.array,
    desiredLrps: types.array,
    colors: types.array.isRequired
  },

  getChildContext: function() {
    var {receptor} = this.state;
    var {colors} = this.props.config;
    return {desiredLrps: receptor.desiredLrps, colors}
  },

  getInitialState() {
    return {receptor: {cells: [], desiredLrps: null}};
  },

  statics: {
    POLL_INTERVAL: 10000
  },

  componentDidMount() {
    var {config} = this.props;

    if (config.receptorUrl) {
      BaseApi.baseUrl = config.receptorUrl;
      this.pollReceptor();
      return;
    }
    var {modal} = this.refs;
    modal.open(<ReceptorUrlModal onSubmit={this.updateReceptorUrl}/>);
  },

  updateReceptor() {
    return ReceptorApi.fetch().then(function({cells, desiredLrps}) {
        var oldCells = this.state.receptor.cells;
        var updatedCells = oldCells;
        var {added, removed, changed} = diff(oldCells, cells, 'cell_id', function(current, next) {
          return current.actual_lrps.map(a => a.since).join('') !== next.actual_lrps.map(a => a.since).join('');
        });

        removed.forEach(function(removedCell) {
          var cellToRemove = updatedCells.find(({cell_id}) => cell_id === removedCell.cell_id);
          updatedCells = update(updatedCells, {$splice: [[updatedCells.indexOf(cellToRemove),1]]});
        });

        changed.forEach(function(changedCell) {
          var cellToUpdate = updatedCells.find(({cell_id}) => cell_id === changedCell.cell_id);
          var oldLrps = cellToUpdate.actual_lrps;
          var updatedLrps = oldLrps;
          var cellIndex = updatedCells.indexOf(cellToUpdate);

          var {added: addedLrps, removed: removedLrps, changed: changedLrps} = diff(
            cellToUpdate.actual_lrps, changedCell.actual_lrps, 'instance_guid', function(current, next) {
              return current.since !== next.since;
            }
          );
          
          removedLrps.forEach(function(removedLrp) {
            var lrpToRemove = updatedLrps.find(({instance_guid}) => instance_guid === removedLrp.instance_guid);
            updatedLrps = update(updatedLrps, {$splice: [[updatedLrps.indexOf(lrpToRemove),1]]});
          });
          
          changedLrps.forEach(function(changedLrp) {
            var lrpToUpdate = updatedLrps.find(({instance_guid}) => instance_guid === changedLrp.instance_guid);
            var lrpIndex = updatedLrps.indexOf(lrpToUpdate);

            lrpToUpdate = update(lrpToUpdate, {$set: changedLrp});
            updatedLrps = update(updatedLrps, {$merge: {[lrpIndex]: lrpToUpdate}});
          });

          updatedLrps = update(updatedLrps, {$push: addedLrps});

          cellToUpdate = update(cellToUpdate, {$merge: {actual_lrps: updatedLrps}});
          updatedCells = update(updatedCells, {$merge: {[cellIndex]: cellToUpdate}});
        });

        updatedCells = update(updatedCells, {$push: added});

        this.setState({receptor: update(this.state.receptor, {$set: {cells: updatedCells, desiredLrps}})});

    }.bind(this),
        reason => console.error('DesiredLrps Promise failed because', reason)
    )
  },

  pollReceptor() {
    this.updateReceptor();
    setCorrectingInterval(this.updateReceptor, Application.POLL_INTERVAL);
  },

  updateReceptorUrl({receptorUrl}) {
    BaseApi.baseUrl = receptorUrl;
    this.pollReceptor();
  },

  render() {
    var {cells} = this.state.receptor;
    return (
      <div className="xray">
        <Zones {...{cells}}/>
        <Modal ref="modal"/>
      </div>
    );
  }
});

Layout.init(Application);

module.exports = Application;
