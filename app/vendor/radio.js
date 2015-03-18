'use strict';

var React = require('react/addons');
var classnames = require('classnames');

var Radio = React.createClass({
  propTypes: {
    checked: React.PropTypes.bool,
    defaultChecked: React.PropTypes.bool,
    name: React.PropTypes.string,
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func,
    id: React.PropTypes.string
  },

  render: function() {
    var {id, checked, className, defaultChecked, name, value, onChange} = this.props;
    return (
      <div className={classnames('radio', className)}>
        <label>
          <input type='radio' {...{id, checked, defaultChecked, name, value, onChange}}>
            {this.props.children}
          </input>
        </label>
      </div>
    );
  }
});

module.exports = {Radio};
