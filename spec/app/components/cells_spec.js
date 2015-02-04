require('../spec_helper');

describe('Cells', function() {
  var Cell, subject, cells;
  beforeEach(function() {
    var Cells = require('../../../app/components/cells');
    Cell = require('../../../app/components/cell');
    spyOn(Cell.type.prototype, 'render').and.callThrough();
    cells = Factory.buildList('cell', 2);
    React.withContext({scaling: 'containers'}, function() {
      subject = React.render(<Cells cells={cells}/>, root);
    });
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders cells', function() {
    expect($('.cell')).toHaveLength(cells.length);
    expect(Cell.type.prototype.render).toHaveBeenCalled();
  });
});