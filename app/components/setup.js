require('babel/polyfill');
var Header = require('./header');
var Footer = require('./footer');
var Layout = require('../../server/components/layout');
var React = require('react/addons');

var Setup = React.createClass({
  render() {
    return (
      <div className="xray">
        <div className="page">
          <Header className="main-header"/>
          <section className="main-content">
            </section>
          <Footer className="main-footer"/>
        </div>
      </div>
    );
  }
});

Layout.init(Setup);

module.exports = Setup;