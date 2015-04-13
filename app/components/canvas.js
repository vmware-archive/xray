var React = require('react/addons');
var types = React.PropTypes;

var Canvas = React.createClass({
  propTypes: {
    height: types.number.isRequired,
    src: types.func.isRequired,
    width: types.number.isRequired
  },

  componentDidMount() {
    var {src} = this.props;
    var {canvas} = this.refs;
    src(canvas.getDOMNode().getContext('2d'));
  },

  render() {
    var {height, width} = this.props;
    return <canvas {...{width, height}} ref="canvas"/>;
  }
});

module.exports = Canvas;