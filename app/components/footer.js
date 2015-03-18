var PureRenderMixin = require('../mixins/pure_render_mixin');
var React = require('react/addons');
var ReceptorMixin = require('../mixins/receptor_mixin');

var pui = Object.assign({}, {
  Icon: require('../vendor/icon').Icon,
  RadioGroup: require('../vendor/radio-group').RadioGroup,
  Radio: require('../vendor/radio').Radio
});

var types = React.PropTypes;

var Footer = React.createClass({
  mixins: [PureRenderMixin, ReceptorMixin],

  propTypes: {
    $scaling: types.object.isRequired
  },

  changeScale(scaling) {
    this.props.$scaling.set(scaling);
  },

  render() {
    var scaling = this.props.$scaling.get();
    return (
      <footer className="footer form-inline type-sm">
        <a role="button"><pui.Icon name="undo" className="fa-flip-horizontal mhl" onClick={this.updateReceptor}/></a>
        <pui.RadioGroup name="scale_type" onChange={this.changeScale}>
          <pui.Radio value="memory_mb" checked={scaling === 'memory_mb'} className="mhl">  memory</pui.Radio>
          <pui.Radio value="containers" checked={scaling === 'containers'} className="mhl"> containers</pui.Radio>
        </pui.RadioGroup>
      </footer>
    );
  }
});

module.exports = Footer;