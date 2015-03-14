var PureRenderMixin = require('../mixins/pure_render_mixin');
var React = require('react/addons');

var Modal = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {title: null};
  },

  open(component) {
    this.setState({component});
  },

  render() {
    var {component} = this.state;
    return (<div className="type-neutral-1">{component}</div>);
  }
});

module.exports = Modal;


