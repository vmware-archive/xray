require('../spec_helper');

describe('Cells', function() {
  var Cell, subject, cells, $receptor, Cursor;
  beforeEach(function() {
    Cursor = require('pui-cursor');
    var Cells = require('../../../app/components/cells');
    Cell = require('../../../app/components/cell');
    spyOn(Cell.prototype, 'render').and.callThrough();
    cells = Factory.buildList('cell', 2);
    var colors = ['#fff', '#000'];
    $receptor = new Cursor({actualLrpsByCellId: {}}, jasmine.createSpy('callback'));
    var $selection = new Cursor({}, jasmine.createSpy('callback'));
    var $sidebar = new Cursor({}, jasmine.createSpy('callback'));
    var props = {cells, $receptor, scaling: 'containers', $selection, $sidebar};
    subject = withContext({colors}, props, function() {
      return (<Cells {...this.props}/>);
    }, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders cells', function() {
    expect($('.cell')).toHaveLength(cells.length);
    expect(Cell.prototype.render).toHaveBeenCalled();
  });

  describe('when actual lrps are provided', function() {
    beforeEach(function() {
      var actualLrps = [
        Factory.build('actualLrp', {cell_id: cells[0].cell_id}),
        Factory.build('actualLrp', {cell_id: cells[0].cell_id})
      ];
      var actualLrpsByCellId = {
        [cells[0].cell_id]: actualLrps
      };
      $receptor = new Cursor({actualLrps, actualLrpsByCellId}, jasmine.createSpy('callback'));
      subject.setProps({$receptor});
    });

    it('renders the cells with the expected actual lrps', function() {
      expect($('.cell:eq(0) .app-container')).toHaveLength(2);
      expect($('.cell:eq(1) .app-container')).not.toExist();
    });
  });
});