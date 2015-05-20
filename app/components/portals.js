var React = require('react/addons');

var types = React.PropTypes;

var portals = {};
var EventEmitter = require('node-event-emitter');
var emitter = new EventEmitter();

var PortalSource = React.createClass({
  propTypes: {
    name: types.string.isRequired
  },

  getInitialState() {
    var {name} = this.props;
    return {
      destination: portals[name]
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
    var {name} = this.props;
    this.isMounted() && this.setState({destination: portals[name]});
  },

  componentDidUpdate() {
    var {destination} = this.state;
    if (destination) React.render(<div>{this.props.children}</div>, destination.getDOMNode());
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
