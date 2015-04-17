var FormGroup = require('./form_group');
var Icon = require('pui-react-iconography').Icon;
var PureRenderMixin = require('../mixins/pure_render_mixin');
var React = require('react/addons');
var types = React.PropTypes;


var ReceptorUrl = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    receptorUrl: types.string.isRequired
  },

  getInitialState() {
    return {receptorUrl: this.props.receptorUrl};
  },

  submit(e) {
    if (!this.refs.receptorUrl.validate()) e.preventDefault();
  },

  change({target}) {
    this.setState({receptorUrl: target.value});
  },

  focus({target}) {
    setTimeout(() => target.select(), 0);
  },

  blur() {
    if (this.state.receptorUrl === this.props.receptorUrl) { return; }
    if (!this.refs.receptorUrl.validate()) {
      this.setState({receptorUrl: this.props.receptorUrl});
      return;
    }
    this.refs.form.getDOMNode().submit();
  },

  validate: input => input.value.length,

  render() {
    var {receptorUrl} = this.state;
    return (
      <form className="receptor-url man" action="/setup" method="POST" onSubmit={this.submit} ref="form">
        <FormGroup className="man" onValidate={this.validate} ref="receptorUrl">
          <label htmlFor="receptor_url" className="man pvxl">
            <span className="inactive-label type-gray-4">Receptor Url</span>
            <span className="active-label link-text"><Icon name="pencil" className="mrm"/>Edit Receptor Url</span>
            <input id="receptor_url" className="form-control type-ellipsis-1-line" name="receptor_url" value={receptorUrl} onFocus={this.focus} onChange={this.change} onBlur={this.blur}/>
          </label>
        </FormGroup>
      </form>
    );
  }
});

module.exports = ReceptorUrl;