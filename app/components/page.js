var BaseApi = require('../api/base_api');
var classnames = require('classnames');
var Cursor = require('pui-cursor');
var Header = require('./header');
var {isString} = require('../../helpers/application_helper');
var Footer = require('./footer');
var LaunchModal = require('./launch_modal');
var Scaling = require('./scaling');
var React = require('react');
var PureRenderMixin = require('pui-cursor/mixins/pure-render-mixin');
var ReceptorMixin = require('../mixins/receptor_mixin');
var ReceptorStreamMixin = require('../mixins/receptor_stream_mixin');
var Slider = require('./slider');
var Sidebar = require('./sidebar');
var Zones = require('./zones');

var types = React.PropTypes;

var Page = React.createClass({
  mixins: [PureRenderMixin, ReceptorMixin, ReceptorStreamMixin],

  propTypes: {
    previewReceptor: types.object,
    selectedReceptor: types.object.isRequired,
    receptorUrl: types.string.isRequired,
    $slider: types.object.isRequired,
    $receptor: types.object.isRequired,
    $scaling: types.object.isRequired,
    $selection: types.object.isRequired,
    $sidebar: types.object.isRequired
  },

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.receptorUrl && !BaseApi.baseUrl) {
      BaseApi.baseUrl = nextProps.receptorUrl;
      this.updateReceptor();
      this.pollReceptor();
      this.streamSSE(nextProps.receptorUrl);
    }
  },

  onScrimClick() {
    this.props.$selection.merge({selectedDesiredLrp: null, hoverDesiredLrp: null});
  },

  render() {
    var {receptorUrl, previewReceptor, selectedReceptor, $scaling, $sidebar, $selection, $slider} = this.props;
    var $selectedReceptor = new Cursor(selectedReceptor, () => {});
    var $previewReceptor = new Cursor(previewReceptor, () => {});
    var selection = !!($selection.get('hoverDesiredLrp') || $selection.get('selectedDesiredLrp')) || $sidebar.get('filter');
    var sidebarCollapsed = $sidebar.get('sidebarCollapsed');

    var classes = classnames(
      'page',
      {
        'sidebar-collapsed': sidebarCollapsed,
        'sidebar-open': !sidebarCollapsed,
        'filtered': $sidebar.get('filter'),
        selection
      }
    );

    var {currentTime, beginningOfTime, hoverPercentage} = $slider.get();
    var hoverPercentage = (typeof hoverPercentage === 'number') && `${100*hoverPercentage}%`;
    var style;
    if (!isString(currentTime)) {
      var sepia = 1 - (currentTime - beginningOfTime) / (Date.now() - beginningOfTime);
      style = {'WebkitFilter': `sepia(${sepia.toPrecision(4) * 100}%)`};
    }

    return (
      <div className={classes} style={style}>
        <Header className="main-header type-neutral-11" {...{$slider}}>
          <LaunchModal title="Edit Receptor" receptorUrl={receptorUrl}>Edit Receptor</LaunchModal>
        </Header>
        <section className="main-content type-neutral-11">
          <article className="main-panel">
            <Zones {...{$receptor: $selectedReceptor, $selection, $sidebar, scaling: $scaling.get(), key: 'the real one'}}/>
            {hoverPercentage && <div className="preview-tooltip" style={{left: hoverPercentage}}>
              <div className="zones-wrapper">
                <Zones {...{className: 'preview', $receptor: $previewReceptor, $selection, $sidebar, scaling: $scaling.get(), key: 'preview'}}/>
              </div>
              <div className="arrow-down"/>
            </div>}
            <Slider {...{$slider}}/>
            <Scaling {...{$receptor: $selectedReceptor, $scaling}}/>
            {$selection.get('selectedDesiredLrp') && <div className="scrim" onClick={this.onScrimClick}/>}
          </article>
          <aside className="sidebar-panel"><Sidebar {...{$receptor: $selectedReceptor, $selection, $sidebar}}/></aside>
        </section>
        <Footer className="main-footer"/>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Page;
