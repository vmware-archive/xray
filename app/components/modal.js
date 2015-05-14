var PureRenderMixin = require('pui-cursor/mixins/pure-render-mixin');
var React = require('react/addons');

var Modal = React.createClass({
  mixins: [PureRenderMixin],

  getInitialState() {
    return {component: null};
  },

  open(component) {
    this.setState({component});
  },

  render() {
    var {component} = this.state;
    return (<div>{component}</div>);
  }
});

module.exports = Modal;