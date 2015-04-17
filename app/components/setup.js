require('babel/polyfill');
var {Col, Row} = require('pui-react-grids');
var Header = require('./header');
var Footer = require('./footer');
var FormGroup = require('./form_group');
var Layout = require('../../server/components/layout');
var {HighlightButton} = require('pui-react-buttons');
var React = require('react/addons');

var types = React.PropTypes;

var Setup = React.createClass({
  propTypes: {
    config: types.object.isRequired
  },

  getInitialState() {
    var {receptorUrl} = this.props.config;
    return {receptorUrl};
  },

  submit(e) {
    if (!this.refs.receptorUrl.validate()) e.preventDefault();
  },

  change({target}) {
    this.setState({receptorUrl: target.value});
  },

  validateReceptorUrl: input => input.value.length,

  render() {
    var {receptorUrl} = this.state;
    return (
      <div className="xray">
        <div className="page">
          <Header className="main-header"/>
          <section className="main-content setup bg-isometric">
            <div className="container">
              <Row>
                <Col md={10} mdOffset={1}>
                  <h1 className="title em-low">Explore the Lattice</h1>
                  <h2 className="em-low"><span className="em-high">X-Ray</span> is an easy to use dashboard for visualizing Lattice clusters. Point X-Ray at your Lattice deployment to view the distribution and status of your containers</h2>
                  <p className="em-low">X-Ray needs a working Lattice environment. <a className="link-text link-inverse" href="http://lattice.cf">Read More</a></p>
                </Col>
                <Col md={10} mdOffset={2}>
                  <hr className="divider-1 hidden-md hidden-lg" />
                  <form action="/setup" method="POST" role="form" onSubmit={this.submit}>
                    <div className="form-group">
                      <label htmlFor="receptor_url" className="h2 em-low type-neutral-11">What's Your Lattice Receptor URL?</label>
                    </div>
                    <FormGroup className="receptor-url" onValidate={this.validateReceptorUrl} ref="receptorUrl">
                      <Row>
                        <Col sm={17}>
                          <input autoFocus id="receptor_url" className="form-control input-lg" name="receptor_url" placeholder="http://receptor.example.com" value={receptorUrl} onChange={this.change}/>
                        </Col>
                        <Col sm={7}>
                          <div className="hidden-sm hidden-md hidden-lg"><br/></div>
                          <HighlightButton type="submit" large>Submit</HighlightButton>
                        </Col>
                      </Row>
                    </FormGroup>
                  </form>
                </Col>
              </Row>
            </div>
          </section>
          <Footer className="main-footer"/>
        </div>
      </div>
    );
  }
});

Layout.init(Setup);

module.exports = Setup;
