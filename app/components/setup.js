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
              <h1 className="title em-low">Explore the Lattice</h1>
              <h2 className="em-low"><span className="em-high">X-Ray</span> is an easy to use dashboard for visualizing Lattice clusters. Point X-Ray at your Lattice deployment to view the distribution and status of your containers</h2>
              <p className="em-low">X-ray needs a working Lattice environment. Read More</p>
            </aside>
            <article>
              <form role="form">
                <div className="form-group">
                  <label><h2 className="em-low">What's Your Lattice Receptor URL?</h2></label>
                </div>
                <div className="form-group">
                  <input className="form-control" name="receptorUrl" placeholder="http://receptor.example.com"/>
                  <button type="submit" className="btn btn-highlight">Submit</button>
                </div>
                <div className="form-group">
                  <label className="checkbox-inline">
                    <input type="checkbox" name="acceptTos"/>
                    Do you accept our Terms of Service?
                  </label>
                </div>
              </form>
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