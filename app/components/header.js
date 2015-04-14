var React = require('react/addons');
var Canvas = require('./canvas');

var Header = React.createClass({
  render() {
    var {className} = this.props;
    return (
      <header className={className}>
        <Canvas src={require('../canvas/logo')} width={50} height={50}/>
        <h1>Pivotal <strong>X-Ray</strong></h1>
      </header>
    );
  }
});

module.exports = Header;