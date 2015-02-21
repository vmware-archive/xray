require('../spec_helper');

describe('HoverDesiredLrpMixin', function() {
  var subject;
  beforeEach(function() {
    var HoverDesiredLrpMixin = require('../../../app/mixins/hover_desired_lrp_mixin');
    var Klass = React.createClass({
      mixins: [HoverDesiredLrpMixin],
      render() { return (<div onClick={this.onClick} onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}/>)}
    });
    var Cursor = require('../../../app/lib/cursor');
    var $receptor = new Cursor({}, jasmine.createSpy('callback'));
    var desiredLrp = Factory.build('desiredLrp');
    subject = React.render(<Klass $receptor={$receptor} desiredLrp={desiredLrp}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('#onClick', function() {
    it('stops progagation', function() {
      var stopPropagationSpy = jasmine.createSpy('stopPropagation');
      $(subject.getDOMNode()).simulate('click', {stopPropagation: stopPropagationSpy});
      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });
});