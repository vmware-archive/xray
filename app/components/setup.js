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
    var {receptorUrl} = this.props.config;
    return {receptorUrl};
  },

  async submit(e) {
    e.preventDefault();
    if (!this.refs.receptorUrl.validate()) return;
    var {receptorUrl} = this.state;
    await SetupApi.create({receptorUrl});
    xray.location.replace(`/?receptor=${receptorUrl}`);
  },

  change({target}) {
    this.setState({[target.name]: target.type === 'checkbox' ? target.checked : target.value});
  },

  validateReceptorUrl: input => input.value.length,

  render() {
    var {receptorUrl} = this.state;
    return (
      <div className="xray">
        <div className="page">
          <Header className="main-header"/>
          <section className="main-content setup">
            <aside>
              <h1 className="title em-low">Explore the Lattice</h1>
              <h2 className="em-low"><span className="em-high">X-Ray</span> is an easy to use dashboard for visualizing Lattice clusters. Point X-Ray at your Lattice deployment to view the distribution and status of your containers</h2>
              <p className="em-low">X-ray needs a working Lattice environment. <a className="link-text link-inverse" href="http://lattice.cf">Read More</a></p>
            </aside>
            <article>
              <form action="/setup" method="POST" role="form" onSubmit={this.submit}>
                <div className="form-group">
                  <h2 className="em-low">What's Your Lattice Receptor URL?</h2>
                </div>
                <FormGroup className="receptor-url" onValidate={this.validateReceptorUrl} ref="receptorUrl">
                  <input autoFocus className="form-control input-lg" name="receptorUrl" placeholder="http://receptor.example.com" value={receptorUrl} onChange={this.change}/>
                  <HighlightButton type="submit" large>Submit</HighlightButton>
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