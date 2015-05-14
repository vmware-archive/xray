var React = require('react/addons');

var types = React.PropTypes;

var Filter = React.createClass({
  propTypes: {
    onFilter: types.func.isRequired,
    value: types.string,
    className: types.string,
    placeholder: types.string,
    style: types.object
  },

  render() {
    var {className, id, onFilter, placeholder, style, value} = this.props;
    return (
      <div {...{id, className, style}}>
        <input className="form-control form-control-inverse" {...{type: 'text', onChange: onFilter, placeholder, value}}/>
      </div>
    );
  }
});

module.exports = Filter;