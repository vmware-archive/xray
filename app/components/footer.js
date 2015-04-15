var React = require('react/addons');
var Canvas = require('./canvas');
var {InlineList, ListItem} = require('pui-react-lists');

var Footer = React.createClass({
  render() {
    var {className} = this.props;
    return (
      <footer className={className}>
        <Canvas src={require('../canvas/brand')} width={74} height={17}/>
        <p className="type-xs">&copy; 2015 Pivotal Software Inc. All rights reserved.</p>
        <InlineList className="type-xs">
          <ListItem><a href="http://pivotal.io/terms-of-use">Terms of Service</a></ListItem>
          <ListItem><a href="http://pivotal.io/privacy-policy">Privacy Policy</a></ListItem>
        </InlineList>
      </footer>
    );
  }
});

module.exports = Footer;