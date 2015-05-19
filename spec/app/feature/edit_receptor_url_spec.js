require('../spec_helper');

describe('features.edit_receptor_url', function() {
  var Application, cells, desiredLrps, actualLrps;
  beforeEach(function() {
    Application = require('../../../app/components/application');
    var props = {config: {receptorUrl: 'http://user:password@example.com', colors: ['#fff', '#000']}};
    cells = [];
    desiredLrps = [];
    actualLrps = [];

    var ReceptorApi = require('../../../app/api/receptor_api');
    var CellsApi = require('../../../app/api/cells_api');
    spyOn(CellsApi, 'fetch').and.callThrough();
    var receptorPromise = new Deferred();
    spyOn(ReceptorApi, 'fetch').and.returnValue(receptorPromise);
    React.render(<Application {...props}/>, root);
    receptorPromise.resolve({actualLrps, cells, desiredLrps});
  });

  afterEach(function() {
    if ($('.modal-dialog button.close').length) {
      $('.modal-dialog button.close').simulate('click');
    }
    React.unmountComponentAtNode(root);
  });

  describe('opening the modal', function() {
    beforeEach(function() {
      $('.main-header button').click();
    });

    it('displays a modal', function() {
      expect('.modal-dialog').toBeVisible();
    });

    it('pre-fills the form fields', function() {
      expect('.modal-dialog input[name="user"]').toHaveValue('user');
      expect('.modal-dialog input[name="password"]').toHaveValue('password');
      expect('.modal-dialog input[name="receptor_url"]').toHaveValue('http://example.com/');
    });

    describe('editing the url', function() {
      var submitSpy;
      beforeEach(function() {
        $('.modal-dialog input[name="user"]').val('Bob').simulate('change');
        submitSpy = jasmine.createSpy('submit').and.callFake(e => e.preventDefault());
        $('.modal-dialog :submit').closest('form').on('submit', submitSpy).trigger('submit');
      });

      it('updates the receptor url', function() {
        expect(submitSpy).toHaveBeenCalled();
        expect($(submitSpy.calls.mostRecent().object).serializeArray()).toEqual([
          {name: 'user', value: 'Bob'},
          {name: 'password', value: 'password'},
          {name: 'receptor_url', value: 'http://example.com/'}
        ]);
      });
    });

    describe('closing the modal with the "x"', function() {
      beforeEach(function() {
        $('.modal-dialog button.close').simulate('click');
      });

      it('closes the modal', function() {
        expect('.modal-dialog').not.toExist();
      });
    });

    describe('cancelling the modal', function() {
      beforeEach(function() {
        $('.modal-footer button:contains("Close")').simulate('click');
      });

      it('closes the modal', function() {
        expect('.modal-dialog').not.toExist();
      });
    });
  });
});
