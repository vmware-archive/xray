var React = require('react');

var types = React.PropTypes;

var Body = React.createClass({
  propTypes: {
    entry: types.func.isRequired,
    scripts: types.array.isRequired
  },

  render() {
    var {entry, scripts} = this.props;
    var scripts = scripts.map(function(src, i) {
      return (<script type="text/javascript" src={src} key={i}/>);
    });
    var Entry = React.createFactory(entry);
    var __html = React.renderToString(Entry());
    return (
      <body>
        <div id="root" dangerouslySetInnerHTML={{__html}}/>
        {scripts}
      </body>
    );
  }
});

var Layout = React.createClass({
  propTypes: {
    entry: types.func.isRequired,
    scripts: types.array.isRequired
  },

  statics: {
    init(Entry, props) {
      if (typeof document !== 'undefined') {
        React.render(<Entry {...props}/>, root);
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