var DesiredLrpsApi = require('../api/desired_lrps_api');
var PureRenderMixin = require('../mixins/pure_render_mixin');
var pui = require('../vendor/buttons');
var React = require('react/addons');

var types = React.PropTypes;

var DesiredLrpScale = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    desiredLrp: types.object.isRequired
  },

  getInitialState() {
    return {
      instances: this.props.desiredLrp.instances
    };
  },

  onChange(e) {
    this.setState({instances: parseInt(e.currentTarget.value)});
  },

  submit(e) {
    e.preventDefault();
    DesiredLrpsApi.scale(this.props.desiredLrp, this.state.instances);
  },

  render() {
    return (
      <div className='desired-lrp-scale phl txt-c'>
        <form className='form-inline' onSubmit={this.submit}>
          <label className='type-neutral-11'>Desired Instances
            <input className='form-control mhm' type="number" min="0" step="1" max="999999" value={this.state.instances} onChange={this.onChange} />
          </label>
          <pui.DefaultButton type="submit">Scale</pui.DefaultButton>
        </form>
      </div>
    );
  }
});

module.exports = DesiredLrpScale;