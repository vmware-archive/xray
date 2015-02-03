require('../spec_helper');

describe('Zones', function() {
  var subject, cells, Cells;
  beforeEach(function() {
    var Zones = require('../../../app/components/zones');
    Cells = require('../../../app/components/cells');
    spyOn(Cells.type.prototype, 'render').and.callThrough();
    cells = Factory.buildList('cell', 3);
    cells[0].zone = 'B';
    cells[1].zone = 'A';
    cells[2].zone = 'A';
    subject = React.render(<Zones cells={cells}/>, root);
  });

  it('renders each zone with the name', function() {
    expect('.zone').toHaveLength(2);
    expect('.zone:eq(0)').toContainText('Zone A');
    expect('.zone:eq(1)').toContainText('Zone B');
  });

  it('renders cells in each zone', function() {
    expect('.zone:eq(0) .cell').toHaveLength(2);
    expect('.zone:eq(1) .cell').toHaveLength(1);
  });
});