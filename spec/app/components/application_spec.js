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
    beforeEach(function() {
      var props = {config: {receptorUrl: RECEPTOR_URL}};
      subject = React.render(<Application {...props}/>, root);
      request = jasmine.Ajax.requests.mostRecent();
    });

    it('renders cells', function() {
      expect(Cells.type.prototype.render).toHaveBeenCalled();
    });

    it('makes an ajax request', function() {
      expect(request).toBeDefined();
      expect(request.url).toEqual(`${RECEPTOR_URL}/v1/cells`);
    });

    describe('when the ajax request is successful', function() {
      var cells;
      beforeEach(function() {
        cells = [{cell_id: 1}, {cell_id: 2}];
        request.respondWith({
          status: 200,
          responseText: JSON.stringify(cells)
        });
        mockPromises.contracts.mostRecent().execute();
      });

      it('sets the cells', function() {
        expect(subject.state.cells).toEqual(cells);
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

      it('makes an ajax request with the right url', function() {
        expect(request).toBeDefined();
        expect(request.url).toEqual(`${NEW_RECEPTOR_URL}/v1/cells`);
      });
    });
  });
});