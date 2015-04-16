var React = require('react/addons');
var Canvas = require('./canvas');
var {Flag} = require('pui-react-media');
var Header = React.createClass({
  render() {
    var {className} = this.props;
    return (
      <header className={className}>
        <Flag leftImage={<Canvas src={require('../canvas/logo')} width={50} height={50}/>}>
          <h1>Pivotal <strong>X-Ray</strong></h1>
        </Flag>
      </header>
    );
  }
});

module.exports = Header;