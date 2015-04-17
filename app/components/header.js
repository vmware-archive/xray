var React = require('react/addons');
var Canvas = require('./canvas');
var {Flag} = require('pui-react-media');

var Header = React.createClass({
  render() {
    var {className, children} = this.props;
    return (
      <header className={className}>
        <Flag leftImage={<Canvas src={require('../canvas/logo')} className="logo" width={50} height={50}/>} rightImage={children} >
          <h1>Pivotal <strong>X-Ray</strong></h1>
        </Flag>
      </header>
    );
  }
});

module.exports = Header;