var React = require('react/addons');
var Canvas = require('./canvas');
var {Flag} = require('pui-react-media');
var {InlineList, ListItem} = require('pui-react-lists');

var Footer = React.createClass({
  render() {
    var {className} = this.props;
    return (
      <footer className={className}>
        <Flag leftImage={<Canvas src={require('../canvas/brand')} width={74} height={17}/>}>
          <InlineList className="type-xs">
            <ListItem>&copy; 2015 Pivotal Software Inc. All rights reserved.
              <div className="hidden-sm hidden-md hidden-lg"><br/></div>
            </ListItem>
            <ListItem><a href="http://pivotal.io/terms-of-use">Terms of Service</a></ListItem>
            <ListItem><a href="http://pivotal.io/privacy-policy">Privacy Policy</a></ListItem>
          </InlineList>
        </Flag>
      </footer>
    );
  }
});

module.exports = Footer;