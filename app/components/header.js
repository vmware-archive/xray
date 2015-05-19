var {Flag} = require('pui-react-media');
var React = require('react/addons');
var Svg = require('./svg');

var Header = React.createClass({
  render() {
    var {className, children} = this.props;
    return (
      <header className={className}>
        <Flag leftImage={<Svg src="logo" className="logo"/>} rightImage={children}>
          <h1>X-Ray</h1>
        </Flag>
      </header>
    );
  }
});

module.exports = Header;