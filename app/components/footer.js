var {InlineList, ListItem} = require('pui-react-lists');
var {Flag} = require('pui-react-media');
var React = require('react/addons');
var Svg = require('./svg');

var Footer = React.createClass({
  render() {
    var {className} = this.props;
    return (
      <footer className={className}>
        <Flag leftImage={<Svg src="brand" className="brand" width={74} height={17}/>}>
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