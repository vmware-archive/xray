var React = require('react/addons');

var types = React.PropTypes;

var portals = {};
var EventEmitter = require('node-event-emitter');
var emitter = new EventEmitter();

var PortalBlue = React.createClass({
  propTypes: {
    name: types.string.isRequired
  },

  getInitialState() {
    var {name} = this.props;
    return {
      orange: portals[name]
    };
  },

  componentWillMount() {
    emitter.on('orange', this.setOrange);
    this.componentDidUpdate();
  },

  componentWillUnmount() {
    emitter.removeListener('orange', this.setOrange);
  },

  setOrange() {
    var {name} = this.props;
    this.isMounted() && this.setState({orange: portals[name]});
  },

  componentDidUpdate() {
    var {orange} = this.state;
    if (orange) React.render(<div>{this.props.children}</div>, orange.getDOMNode());
  },

  render() {
    return null;
  }
});

var PortalOrange = React.createClass({
  propTypes: {
    name: types.string.isRequired
  },

  componentDidMount() {
    var {name} = this.props;
    portals[name] = this;
    emitter.emit('orange', this);
  },

  componentWillUnmount() {
    var {name} = this.props;
    delete portals[name];
    emitter.emit('orange', this);
  },

  render() {
    return (<div/>);
  }
});

module.exports = {
  PortalBlue,
  PortalOrange,
  reset() {
    emitter.removeAllListeners();
    portals = {};
  }
};
