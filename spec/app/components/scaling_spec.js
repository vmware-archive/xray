require('../spec_helper');

describe('Scaling', function() {
  var callbackSpy;
  beforeEach(function() {
    var Cursor = require('../../../app/lib/cursor');
    callbackSpy = jasmine.createSpy('callback');
    var $scaling = new Cursor('containers', callbackSpy);
    var $receptor = new Cursor({}, jasmine.createSpy('callback'));
    var Scaling = require('../../../app/components/scaling');
    React.render(<Scaling {...{$scaling, $receptor}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('scaling options', function() {
    it('defaults to containers', function() {
      expect('label:contains("containers") :radio').toBeChecked();
    });

    describe('selecting a new option', function() {
      beforeEach(function() {
        callbackSpy.calls.reset();
        $('label:contains("memory") :radio').simulate('change').simulate('click');
      });

      it('uses the new scaling', function() {
        expect(callbackSpy).toHaveBeenCalledWith('memory_mb');
      });
    });
  });
});