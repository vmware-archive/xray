var React = require('react/addons');
var Canvas = require('./canvas');

var Header = React.createClass({
  render() {
    var {className, children} = this.props;
    return (
      <header className={className}>
        <div className="logo"><Canvas src={require('../canvas/logo')} width={50} height={50}/></div>
        <h1>Pivotal <strong>X-Ray</strong></h1>
        {children}
      </header>
    );
  }
});

module.exports = Header;