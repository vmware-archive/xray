require('../spec_helper');

describe('Header', function() {
  var moment, Cursor, subject;
  beforeEach(function() {
    var Header = require('../../../app/components/header');
    moment = require('moment');
    Cursor = require('pui-cursor');
    var $slider = new Cursor({currentTime: 'now'}, jasmine.createSpy('callback'));
    subject = React.render(<Header {...{$slider}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders the selected receptor time', function() {
    expect('.media-body').toContainText('live');
  });

  describe('when the time is not now', function() {
    const currentTime = 10000000;
    beforeEach(function() {
      var $slider = new Cursor({currentTime}, jasmine.createSpy('callback'));
      subject.setProps({$slider});
    });

    it('renders the correct time', function() {
      expect('.media-body').toContainText(moment(currentTime).format('LTS'));
    });
  });
});