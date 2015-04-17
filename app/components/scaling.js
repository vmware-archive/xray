var Icon = require('pui-react-iconography').Icon;
var PureRenderMixin = require('../mixins/pure_render_mixin');
var Radio = require('pui-react-radio').Radio;
var RadioGroup = require('pui-react-radio-group').RadioGroup;
var React = require('react/addons');
var ReceptorMixin = require('../mixins/receptor_mixin');

var types = React.PropTypes;

var Scaling = React.createClass({
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
        <a role="button"><Icon name="undo" className="fa-flip-horizontal mhl" onClick={this.updateReceptor}/></a>
        <RadioGroup className="form-group" name="scale_type" onChange={this.changeScale}>
          <Radio value="memory_mb" checked={scaling === 'memory_mb'}>  memory</Radio>
          <Radio value="containers" checked={scaling === 'containers'}> containers</Radio>
        </RadioGroup>
      </footer>
    );
  }
});

module.exports = Scaling;