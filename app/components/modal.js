var React = require('react/addons');

var Modal = React.createClass({
  getInitialState() {
    return {title: null};
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


