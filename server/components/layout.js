var React = require('react');

var types = React.PropTypes;

var Body = React.createClass({
  propTypes: {
    entry: types.func.isRequired,
    scripts: types.array.isRequired
  },

  render() {
    var {config, entry, scripts} = this.props;
    scripts = scripts.map(function(src, i) {
      return (<script type="text/javascript" src={src} key={i}/>);
    });
    var Entry = React.createFactory(entry);
    var __html = React.renderToString(Entry({config}));
    var configScript = `var xray = {}; xray.config = ${JSON.stringify(config)};`;
    return (
      <body>
        <div id="root" dangerouslySetInnerHTML={{__html}}/>
        <script type="text/javascript" dangerouslySetInnerHTML={{__html: configScript}}/>
        {scripts}
      </body>
    );
  }
});

var Layout = React.createClass({
  propTypes: {
    entry: types.func.isRequired,
    scripts: types.array.isRequired,
    config: types.object
  },

  statics: {
    init(Entry) {
      if (typeof document !== 'undefined') {
        React.render(<Entry {...{config: xray.config}}/>, root);
      }
    }
  },

  render() {
    return (
      <html>
        <Body {...this.props}/>
      </html>
    );
  }
});

module.exports = Layout;