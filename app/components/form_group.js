var classnames = require('classnames');
var React = require('react/addons');
var types = React.PropTypes;

var FormGroup = React.createClass({
  propTypes: {
    onValidate: types.func.isRequired,
    helpBlock: types.oneOfType([types.object, types.string])
  },

  getInitialState() {
    return {valid: true};
  },

  validate() {
    var input = this.getDOMNode().querySelector('input');
    var valid = input && this.props.onValidate(input);
    this.setState({valid});
    return valid;
  },

  render() {
    var {valid} = this.state;
    var {className, children, helpBlock} = this.props;
    var helpBlockClassName = classnames('help-block', {'has-error': !valid});
    return (
      <div className={classnames(className, 'form-group', {'has-error': !valid})}>
        {children}
        {helpBlock && !valid && <span className={helpBlockClassName}>{helpBlock}</span>}
      </div>
    );
  }
});

module.exports = FormGroup;