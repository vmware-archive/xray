var React = require('react/addons');
var {pickColor} = require('../helpers/application_helper');
var PUI = {Media: require('../vendor/media').Media};

var types = React.PropTypes;

var Sidebar = React.createClass({
  propTypes: {
    $receptor: types.object.isRequired
  },

  contextTypes: {
    colors: types.array.isRequired
  },

  render() {
    var {$receptor} = this.props;

    var desiredLrps = ($receptor.get('desiredLrps') || []).map(function({process_guid: processGuid}) {
        var backgroundColor = pickColor(this.context.colors, processGuid);
        var style = {backgroundColor};
        var leftImage = (<a className="container-sidebar" style={style} role="button"/>);
        return (<PUI.Media leftImage={leftImage} key={processGuid}>{processGuid}</PUI.Media>);
    }, this);

    return <div>{desiredLrps}</div>
  }
});

module.exports = Sidebar;