require('../spec_helper');

describe('Zones', function() {
  var subject, cells, Cells;
  beforeEach(function() {
    var Zones = require('../../../app/components/zones');
    Cells = require('../../../app/components/cells');
    spyOn(Cells.type.prototype, 'render').and.callThrough();
    var desiredLrps = Factory.buildList('desiredLrp', 3);
    cells = Factory.buildList('cell', 3);
    Object.assign(cells[0], {zone: 'B', actual_lrps: Factory.buildList('actualLrp', 1, {process_guid: desiredLrps[0].process_guid})});
    Object.assign(cells[1], {zone: 'A', actual_lrps: Factory.buildList('actualLrp', 1, {process_guid: desiredLrps[1].process_guid})});
    Object.assign(cells[2], {zone: 'A', actual_lrps: Factory.buildList('actualLrp', 1, {process_guid: desiredLrps[2].process_guid})});
    var colors = ['#fff', '#000'];

    var Cursor = require('../../../app/lib/cursor');
    var $receptor = new Cursor({cells, desiredLrps}, jasmine.createSpy('callback'));
    React.withContext({colors}, function() {
      subject = React.render(<Zones {...{$receptor}}/>, root);
    });
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
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