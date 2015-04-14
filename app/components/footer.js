var React = require('react/addons');
var Canvas = require('./canvas');
var {InlineList, ListItem} = require('pui-react-lists');

var Footer = React.createClass({
  render() {
    var {className} = this.props;
    return (
      <footer className={className}>
        <Canvas src={require('../canvas/brand')} width={74} height={17}/>
        <p>&copy; 2015 Pivotal Software Inc. All rights reserved.</p>
        <InlineList>
          <ListItem>Terms of Service</ListItem>
          <ListItem>Privacy Policy</ListItem>
        </InlineList>
      </footer>
    );
  }
});

module.exports = Footer;