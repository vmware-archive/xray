var React = require('react/addons');
var Canvas = require('./canvas');
var {Flag} = require('pui-react-media');

var Header = React.createClass({
  render() {
    var {className, children} = this.props;
    return (
      <header className={className}>
        <Flag leftImage={<Canvas src={require('../canvas/logo')} className="logo" width={40} height={40}/>} rightImage={children} >
          <h1>X-Ray</h1>
        </Flag>
      </header>
    );
  }
});

module.exports = Header;