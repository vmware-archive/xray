var BaseApi = require('../api/base_api');
var React = require('react/addons');
var ReceptorApi = require('../api/receptor_api');
var {setCorrectingInterval} = require('correcting-interval');
var {diff} = require('../helpers/array_helper');

var types = React.PropTypes;

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

var Page = React.createClass({
  propTypes: {
    receptorUrl: types.string,
    $receptor: types.object.isRequired
  },

  statics: {
    POLL_INTERVAL: 10000
  },

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.receptorUrl && !BaseApi.baseUrl) {
      BaseApi.baseUrl = nextProps.receptorUrl;
      this.pollReceptor();
    }
  },

  updateReceptor() {
    var {$receptor} = this.props;
    return ReceptorApi.fetch().then(function({actualLrps, cells, desiredLrps}) {
        $receptor.update({
          cells: applyUpdate(cells, 'cell_id'),
          actualLrps: applyUpdate(actualLrps, 'instance_guid', (a, b) => a.since !== b.since),
          desiredLrps: applyUpdate(desiredLrps, 'process_guid')
        });
      }.bind(this),
        reason => console.error('DesiredLrps Promise failed because', reason)
    );
  },

  pollReceptor() {
    this.updateReceptor();
    setCorrectingInterval(this.updateReceptor, Page.POLL_INTERVAL);
  },

  render() {
    return (<div>{this.props.children}</div>);
  }
});

module.exports = Page;
