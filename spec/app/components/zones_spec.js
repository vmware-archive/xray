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
    subject = React.render(<Zones {...{cells}}/>, root);
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

  describe('scaling options', function() {
    it('defaults to containers', function() {
      expect('label:contains("containers") :radio').toBeChecked();
      expect(subject.state.scaling).toEqual('containers');
    });

    describe('selecting a new option', function() {
      beforeEach(function() {
        $('label:contains("memory") :radio').simulate('change').simulate('click');
      });

      it('uses the new scaling', function() {
        expect(subject.state.scaling).toEqual('memory_mb');
      });
    });
  });
});