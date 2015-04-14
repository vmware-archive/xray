var React = require('react/addons');
var types = React.PropTypes;

var Canvas = React.createClass({
  propTypes: {
    src: types.func.isRequired,
    height: types.number.isRequired,
    width: types.number.isRequired
  },

  componentDidMount() {
    var {src} = this.props;
    var {canvas} = this.refs;
    src(canvas.getDOMNode().getContext('2d'));
  },

  render() {
    var {height, width, className} = this.props;
    return <canvas {...{width, height, className}} ref="canvas"/>;
  }
});

module.exports = Canvas;