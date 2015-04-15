var React = require('react/addons');
var types = React.PropTypes;

var Canvas = React.createClass({
  propTypes: {
    src: types.func.isRequired,
    height: types.number.isRequired,
    width: types.number.isRequired
  },

  componentDidMount() {
    var {src, width, height} = this.props;
    var {canvas} = this.refs;
    var canvasNode = canvas.getDOMNode();
    var {pixelRatio = 1} = window;
    canvasNode.width = width * pixelRatio;
    canvasNode.height = height * pixelRatio;
    var ctx = canvasNode.getContext('2d');
    ctx.scale(pixelRatio, pixelRatio);
    src(ctx);
  },

  render() {
    var {height, width, className} = this.props;
    var style = {width: `${width}px`, height: `${height}px`};
    return <canvas {...{width, height, className, style, ref: 'canvas'}}/>;
  }
});

module.exports = Canvas;