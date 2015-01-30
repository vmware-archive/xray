require('../spec_helper');

describe('Application', function() {
  const RECEPTOR_URL = 'http://example.com';
  var Cells, subject, request;
  beforeEach(function() {
    Cells = require('../../../app/components/cells');
    spyOn(Cells.type.prototype, 'render').and.callThrough();
    var Application = require('../../../app/components/application');
    var props = {receptorUrl: RECEPTOR_URL};
    subject = React.render(<Application {...props}/>, root);
    request = jasmine.Ajax.requests.mostRecent();
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
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