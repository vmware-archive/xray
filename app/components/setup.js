require('babel/polyfill');
var {Col, Row} = require('pui-react-grids');
var Footer = require('./footer');
var googleAnalyticsMixin = require('../mixins/google_analytics_mixin');
var Header = require('./header');
var LaunchModal = require('./launch_modal');
var Layout = require('../../server/components/layout');
var React = require('react');
var {PortalDestination} = require('./portals');
var types = React.PropTypes;

var Setup = React.createClass({
  mixins: [googleAnalyticsMixin],

  propTypes: {
    config: types.object.isRequired
  },

  render() {
    var {config: {receptorUrl}} = this.props;
    return (
      <div className="xray">
        <div className="page">
          <Header className="main-header type-neutral-11">
            <LaunchModal title="Launch X-Ray" receptorUrl={receptorUrl}>Launch X-Ray</LaunchModal>
          </Header>
          <section className="main-content setup bg-isometric type-neutral-11">
            <div className="container">
              <Row>
                <Col md={10} mdOffset={1}>
                  <h1 className="title em-low">Explore the Lattice</h1>
                  <h2 className="em-low"><span className="em-high">X-Ray</span> is an easy to use dashboard for visualizing Lattice clusters. Point X-Ray at your Lattice deployment to view the distribution and status of your containers</h2>
                  <p className="em-low">X-Ray needs a working Lattice environment. <a className="link-text link-inverse" href="http://lattice.cf">Read More</a></p>
                </Col>
              </Row>
            </div>
          </section>
          <Footer className="main-footer"/>
        </div>
        <PortalDestination name="modal"/>
      </div>
    );
  }
});

Layout.init(Setup);

module.exports = Setup;
