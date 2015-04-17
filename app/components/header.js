var React = require('react/addons');
var Canvas = require('./canvas');

var Header = React.createClass({
  render() {
    var {className} = this.props;
    return (
      <header className={className}>
        <h1 className="logo">
          <Canvas src={require('../canvas/logo')} width={50} height={50} className="logo-mark" />
          <span className="logo-type">
            <span>Pivotal</span>
            <strong>X-Ray</strong>
          </span>
        </h1>
        <label className="receptor-change mvn" for="receptor">
          <p className="label-1 type-neutral-6 type-xs em-alt em-default mvn">Receptor URL</p>
          <p className="label-2 type-accent-3 type-xs em-alt em-default mvn">
            <i className="fa fa-pencil mrm"></i>
            Edit Receptor URL
          </p>
          <p className="type-neutral-11 mvn">
            <input type='text' placeholder='http://example.receptor.com' className="unstyled" name="receptor" id="receptor"></input>
          </p>
        </label>
      </header>
    );
  }
});

module.exports = Header;
