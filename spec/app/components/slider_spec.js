require('../spec_helper');

describe('Slider', function() {
  beforeEach(function() {
    var Slider = require('../../../app/components/slider');
    var Cursor = require('pui-cursor');
    var currentTimeSpy = jasmine.createSpy('currentTime');
    var $currentTime = new Cursor(Date.now(), currentTimeSpy);
    React.render(<Slider {...{$currentTime}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders a slider with a handle', function() {
    expect('.slider').toExist();
    expect('.handle').toExist();
  });
});
