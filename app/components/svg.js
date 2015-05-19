var React = require('react/addons');

var types = React.PropTypes;

var Svg = React.createClass({
  propTypes: {
    src: types.string.isRequired
  },

  getInitialState() {
    return {attributes: null, content: null};
  },

  componentDidMount() {
    var {attributes, content} = require(`../svg/${this.props.src}.svg`);
    this.setState({attributes, content});
  },

  render() {
    var {attributes, content} = this.state;
    if (!content) return null;
    return <svg {...attributes} {...this.props} dangerouslySetInnerHTML={{__html: content}}/>;
  }
});

module.exports = Svg;
