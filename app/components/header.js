var React = require('react/addons');
var Logo = require('../svg/logo');
var {Flag} = require('pui-react-media');

var Header = React.createClass({
  render() {
    var {className, children} = this.props;
    return (
      <header className={className}>
        <Flag leftImage={<Logo className="logo"/>} rightImage={children}>
          <h1>X-Ray</h1>
        </Flag>
      </header>
    );
  }
});

module.exports = Header;