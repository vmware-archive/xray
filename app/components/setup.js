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
          <section className="main-content setup">
            <aside>
              <h1 className="title">Explore the Lattice</h1>
              <p><strong>X-Ray</strong> is an easy to use dashboard for visualizing Lattice clusters. Point X-Ray at your Lattice deployment to view the distribution and status of your containers</p>
              <p>X-ray needs a working Lattice environment. Read More</p>
            </aside>
            <article>
              Form
            </article>
          </section>
          <Footer className="main-footer"/>
        </div>
      </div>
    );
  }
});

Layout.init(Setup);

module.exports = Setup;