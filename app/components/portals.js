var React = require('react/addons');

var types = React.PropTypes;

var portals = {};
var EventEmitter = require('node-event-emitter');
var emitter = new EventEmitter();

function createRoot(reactElement) {
  var destination = document.createElement('div');
  reactElement.getDOMNode().appendChild(destination);
  return destination;
}

var PortalSource = React.createClass({
  propTypes: {
    name: types.string.isRequired
  },

  getInitialState() {
    var {name} = this.props;
    return {
      destination: portals[name] && {portal: portals[name], root: createRoot(portals[name])}
    };
  },

  componentWillMount() {
    emitter.on('destination', this.setDestination);
    this.componentDidUpdate();
  },

  componentWillUnmount() {
    emitter.removeListener('destination', this.setDestination);
  },

  setDestination() {
    var {destination} = this.state;
    var {name} = this.props;
    if (!this.isMounted() || (destination && destination.portal === portals[name])) return;
    this.setState({destination: portals[name] && {portal: portals[name], root: createRoot(portals[name])}});
  },

  componentDidUpdate() {
    var {root} = this.state.destination || {};
    if (root) React.render(<div>{this.props.children}</div>, root);
  },

  render() {
    return null;
  }
});

var PortalDestination = React.createClass({
  propTypes: {
    name: types.string.isRequired
  },

  componentDidMount() {
    var {name} = this.props;
    portals[name] = this;
    emitter.emit('destination', this);
  },

  componentWillUnmount() {
    var {name} = this.props;
    delete portals[name];
    emitter.emit('destination', this);
  },

  render() {
    return (<div/>);
  }
});

module.exports = {
  PortalSource,
  PortalDestination,
  reset() {
    emitter.removeAllListeners();
    portals = {};
  }
};
