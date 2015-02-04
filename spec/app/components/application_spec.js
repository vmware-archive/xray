require('../spec_helper');

describe('Application', function() {
  const RECEPTOR_URL = 'http://example.com';
  var Application, Cells, subject, request;
  beforeEach(function() {
    Cells = require('../../../app/components/cells');
    spyOn(Cells.type.prototype, 'render').and.callThrough();
    Application = require('../../../app/components/application');
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('when a receptor url is provided in configuration', function() {
    var ReceptorApi, cells, desiredLrps;

    beforeEach(function() {
      var props = {config: {receptorUrl: RECEPTOR_URL}};
      cells = Factory.buildList('cell', 2);
      desiredLrps = Factory.buildList('desiredLrp', 3);
      ReceptorApi = require('../../../app/api/receptor_api');
      var receptorPromise = Deferred();
      spyOn(ReceptorApi, 'fetch').and.returnValue(receptorPromise);
      subject = React.render(<Application {...props}/>, root);
      receptorPromise.resolve({cells, desiredLrps});
    });

    it('renders cells', function() {
      expect(Cells.type.prototype.render).toHaveBeenCalled();
    });

    it('sets the cells', function() {
      expect(subject.state.receptor.cells).toEqual(cells);
    });

    describe('#pollReceptor', function() {
      describe('when the poll interval time has passed', function() {
        beforeEach(function() {
          ReceptorApi.fetch.calls.reset();
          jasmine.clock().tick(Application.POLL_INTERVAL);
        });

        it('fetches the receptor', function() {
          expect(ReceptorApi.fetch).toHaveBeenCalled();
        });
      });
    });
  });

  describe('when no receptor url is provided in configuration', function() {
    var Modal;
    beforeEach(function() {
      Modal = require('../../../app/components/modal');
      jasmineReact.spyOnClass(Modal, 'open').and.callThrough();
      var props = {config: {}};
      subject = React.render(<Application {...props}/>, root);
      request = jasmine.Ajax.requests.mostRecent();
    });

    it('launches a modal asking for the url', function() {
      var {type} = require('../../../app/components/receptor_url_modal');
      expect(Modal.type.prototype.open).toHaveBeenCalledWith(jasmine.objectContaining({type}));
    });

    describe('when the user submits a receptor url', function() {
      const NEW_RECEPTOR_URL = 'http://foo.com';
      beforeEach(function() {
        $('.receptor-url-modal :text').val(NEW_RECEPTOR_URL).simulate('change');
        $('form.receptor-url-modal').simulate('submit');
        request = jasmine.Ajax.requests.mostRecent();
      });

      it('makes ajax requests for the cells', function() {
        expect(jasmine.Ajax.requests.filter(`${NEW_RECEPTOR_URL}/v1/cells`)[0]).toBeDefined();
        expect(jasmine.Ajax.requests.filter(`${NEW_RECEPTOR_URL}/v1/actual_lrps`)[0]).toBeDefined();
      });

      it('makes ajax requests for the desired lrps', function() {
        expect(jasmine.Ajax.requests.filter(`${NEW_RECEPTOR_URL}/v1/desired_lrps`)[0]).toBeDefined();
      });
    });
  });
});