require('../spec_helper');

describe('Svg', function() {
  var subject;
  beforeEach(function() {
    var Svg = require('../../../app/components/svg');
    Svg.prototype.render.and.callThrough();
    subject = React.render(<Svg src="brand"/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders an svg', function() {
    expect('svg').toExist();
    expect('svg path').toExist();
  });

  it('renders the svg with the html attributes', function() {
    expect('svg').toHaveAttr('x', '0px');
    expect('svg').toHaveAttr('y', '0px');
    expect('svg').toHaveAttr('viewBox', '563 591.5 74 17');
  });

  describe('when there are props on the svg', function() {
    it('overrids the html attributes', function() {
      subject.setProps({x: '10px', y: '20px'});
      expect('svg').toHaveAttr('x', '10px');
      expect('svg').toHaveAttr('y', '20px');
    });
  });
});