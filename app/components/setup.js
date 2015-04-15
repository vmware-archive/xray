require('babel/polyfill');
var Header = require('./header');
var Footer = require('./footer');
var FormGroup = require('./form_group');
var Layout = require('../../server/components/layout');
var {HighlightButton} = require('pui-react-buttons');
var React = require('react/addons');
var SetupApi = require('../api/setup_api');

var types = React.PropTypes;

var Setup = React.createClass({
  propTypes: {
    config: types.object.isRequired
  },

  getInitialState() {
    var {acceptTos, receptorUrl} = this.props.config;
    return {receptorUrl, acceptTos};
  },

  async submit(e) {
    e.preventDefault();
    if (!this.refs.receptorUrl.validate() || !this.refs.ToS.validate()) return;
    var {receptorUrl} = this.state;
    await SetupApi.create({receptorUrl});
    xray.location.replace(`/?receptor=${receptorUrl}`);
  },

  change({target}) {
    this.setState({[target.name]: target.type === 'checkbox' ? target.checked : target.value});
  },

  validateReceptorUrl: input => input.value.length,

  validateTos: input => input.checked,

  render() {
    var {acceptTos, receptorUrl} = this.state;
    return (
      <div className="xray">
        <div className="page">
          <Header className="main-header"/>
          <section className="main-content setup">
            <div className="bg-isometric"></div>
            <div className="r-gradient"></div>
            <div className="l-gradient"></div>
            <aside>
              <h1 className="title em-low">Explore the Lattice</h1>
              <h2 className="em-low"><span className="em-high">X-Ray</span> is an easy to use dashboard for visualizing Lattice clusters. Point X-Ray at your Lattice deployment to view the distribution and status of your containers</h2>
              <p className="em-low">X-ray needs a working Lattice environment. Read More</p>
            </aside>
            <article>
              <form action="/setup" method="POST" role="form" onSubmit={this.submit}>
                <div className="form-group">
                  <h2 className="em-low">What's Your Lattice Receptor URL?</h2>
                </div>
                <FormGroup className="receptor-url" onValidate={this.validateReceptorUrl} ref="receptorUrl">
                  <input autoFocus className="form-control" name="receptorUrl" placeholder="http://receptor.example.com" value={receptorUrl} onChange={this.change}/>
                  <HighlightButton type="submit" className="btn btn-highlight">Submit</HighlightButton>
                </FormGroup>
                <FormGroup helpBlock="You must accept the terms of service to continue!" onValidate={this.validateTos} ref="ToS">
                  <label className="checkbox-inline control-label">
                    <input type="checkbox" name="acceptTos" checked={acceptTos} onChange={this.change}/>
                    Do you accept our Terms of Service?
                  </label>
                </FormGroup>
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
