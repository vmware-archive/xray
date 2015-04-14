require('babel/polyfill');
var Header = require('./header');
var Footer = require('./footer');
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
    return {
      receptorUrl: '',
      acceptTos: this.props.config.acceptTos
    };
  },

  async submit(e) {
    e.preventDefault();
    var {receptorUrl} = this.state;
    try {
      await SetupApi.create({receptorUrl});
      xray.location.replace(`/?receptor=${receptorUrl}`);
    } catch(e) {
    }
  },

  change: function(e) {
    this.setState({[e.target.name]: e.target.value});
  },

  render() {
    var {acceptTos, receptorUrl} = this.state;
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
              <form action="/setup" method="POST" role="form" onSubmit={this.submit}>
                <div className="form-group">
                  <label><h2 className="em-low">What's Your Lattice Receptor URL?</h2></label>
                </div>
                <div className="form-group">
                  <input autoFocus className="form-control" name="receptorUrl" placeholder="http://receptor.example.com" value={receptorUrl} onChange={this.change}/>
                  <HighlightButton type="submit" className="btn btn-highlight">Submit</HighlightButton>
                </div>
                <div className="form-group">
                  <label className="checkbox-inline">
                    <input type="checkbox" name="acceptTos" checked={acceptTos} onChange={this.change}/>
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