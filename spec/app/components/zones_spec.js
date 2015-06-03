require('../spec_helper');

describe('Zones', function() {
  var cells, Cells;
  beforeEach(function() {
    var Zones = require('../../../app/components/zones');
    Cells = require('../../../app/components/cells');
    spyOn(Cells.prototype, 'render').and.callThrough();
    var desiredLrps = Factory.buildList('desiredLrp', 3);
    cells = Factory.buildList('cell', 3);
    Object.assign(cells[0], {zone: 'B', actual_lrps: Factory.buildList('actualLrp', 1, {process_guid: desiredLrps[0].process_guid})});
    Object.assign(cells[1], {zone: 'A', actual_lrps: Factory.buildList('actualLrp', 1, {process_guid: desiredLrps[1].process_guid})});
    Object.assign(cells[2], {zone: 'A', actual_lrps: Factory.buildList('actualLrp', 1, {process_guid: desiredLrps[2].process_guid})});
    var colors = ['#fff', '#000'];

    var Cursor = require('pui-cursor');
    var $selection = new Cursor({}, jasmine.createSpy('callback'));
    var $sidebar = new Cursor({}, jasmine.createSpy('callback'));
    var $receptor = new Cursor({cells, desiredLrps, actualLrpsByCellId: {}}, jasmine.createSpy('callback'));
    var scaling = 'containers';
    withContext({colors}, function() {
      return (<Zones {...{$receptor, $selection, scaling, $sidebar}}/>);
    }, root);
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
});