var React = require('react');

var types = React.PropTypes;

var Body = React.createClass({
  propTypes: {
    entry: types.func.isRequired,
    scripts: types.array.isRequired
  },

  render() {
    var {config, entry, scripts, className} = this.props;
    scripts = scripts.map(function(src, i) {
      return (<script type="text/javascript" src={src} key={i}/>);
    });
    var entryFactory = React.createFactory(entry);
    var __html = React.renderToString(entryFactory({config}));
    /*eslint-disable comma-spacing*/
    var configScript = `var xray = {config: ${JSON.stringify(config)}, location: location};`;
    /*eslint-enable comma-spacing*/
    return (
      <body className={className}>
        <main id="root" dangerouslySetInnerHTML={{__html}}/>
        <script type="text/javascript" dangerouslySetInnerHTML={{__html: configScript}}/>
        {scripts}
      </body>
    );
  }
});

var Layout = React.createClass({
  propTypes: {
    entry: types.func.isRequired,
    stylesheets: types.array.isRequired,
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
    var {stylesheets} = this.props;

    stylesheets = stylesheets.map(function(href, i) {
      return (<link rel="stylesheet" type="text/css" href={href} key={i}/>);
    });

    return (
      <html>
        <head>
          <meta name="viewport" content="width=device-width"/>
          {stylesheets}
        </head>
        <Body {...this.props}/>
      </html>
    );
  }
});

module.exports = Layout;