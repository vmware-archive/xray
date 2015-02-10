require('../spec_helper');

describe('Cells', function() {
  var Cell, subject, cells;
  beforeEach(function() {
    var Cells = require('../../../app/components/cells');
    Cell = require('../../../app/components/cell');
    spyOn(Cell.type.prototype, 'render').and.callThrough();
    cells = Factory.buildList('cell', 2);
    var colors = ['#fff', '#000'];
    React.withContext({scaling: 'containers', colors}, function() {
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

  describe('when actual lrps are provided', function() {
    beforeEach(function() {
      var actualLrps = [
        Factory.build('actualLrp', {cell_id: cells[0].cell_id}),
        Factory.build('actualLrp', {cell_id: cells[0].cell_id})
      ];
      subject.setProps({actualLrps, desiredLrps: []});
    });

    it('renders the cells with the expected actual lrps', function() {
      expect($('.cell:eq(0) .container')).toHaveLength(2);
      expect($('.cell:eq(1) .container')).not.toExist();
    });
  });
});