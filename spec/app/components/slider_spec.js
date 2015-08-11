require('../spec_helper');

describe('Slider', function() {
  beforeEach(function() {
    var Slider = require('../../../app/components/slider');
    var Cursor = require('pui-cursor');
    var sliderSpy = jasmine.createSpy('slider');
    var $slider = new Cursor({currentTime: Date.now(), beginningOfTime: Date.now()}, sliderSpy);
    React.render(<Slider {...{$slider}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders a slider with a handle', function() {
    expect('.slider').toExist();
    expect('.handle').toExist();
  });
});
