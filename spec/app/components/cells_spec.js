require('../spec_helper');

describe('Cells', function() {
  var Cell, subject, cells;
  beforeEach(function() {
    var Cells = require('../../../app/components/cells');
    Cell = require('../../../app/components/cell');
    spyOn(Cell.type.prototype, 'render').and.callThrough();
    cells = Factory.buildList('cell', 2);
    subject = React.render(<Cells cells={cells}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders cells', function() {
    expect($('.cell')).toHaveLength(cells.length);
    expect(Cell.type.prototype.render).toHaveBeenCalled();
    expect($('.cell:eq(0) .actual-lrp')).toHaveLength(cells[0].actual_lrps.length);
    expect($('.cell:eq(1) .actual-lrp')).toHaveLength(cells[1].actual_lrps.length);
  });
});