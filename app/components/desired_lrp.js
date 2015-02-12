var React = require('react/addons');
var {mergeClassNames} = require('../helpers/application_helper');
var prettyBytes = require('pretty-bytes');
var PUI = {Media: require('../vendor/media').Media};
var cx = React.addons.classSet;

var types = React.PropTypes;

var DesiredLrp = React.createClass({
  propTypes: {
    desiredLrp: types.object.isRequired,
    containerColor: types.string
  },

  contextTypes: {
    colors: types.array.isRequired
  },

  render() {
    var {desiredLrp, containerColor, className} = this.props;
    var {disk_mb: disk, memory_mb: memory, process_guid: processGuid} = desiredLrp;
    var imageStyle = {backgroundColor: containerColor};
    var leftImage = (<a className="container-sidebar" style={imageStyle} role="button"/>);
    disk = prettyBytes(disk * 1000000);
    memory = prettyBytes(memory * 1000000);
    className = mergeClassNames(className, cx({'desired-lrp': true, 'pam': true}));

    return (
      <PUI.Media leftImage={leftImage} key={processGuid} className={className}>
        <section>
          <div className="type-ellipsis-1-line">{processGuid}</div>
          <div>Disk: {disk}</div>
          <div>Memory: {memory}</div>
        </section>
      </PUI.Media>
    );
  }
});

module.exports = DesiredLrp;
