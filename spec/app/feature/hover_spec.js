require('../spec_helper');

describe('features.hovering', function() {
  const RECEPTOR_URL = 'http://example.com';
  var Application, cells, desiredLrps, actualLrps;
  beforeEach(function() {
    Application = require('../../../app/components/application');
    var props = {config: {receptorUrl: RECEPTOR_URL, colors: ['#fff', '#000']}};
    cells = [
      Factory.build('cell', {zone: 'z1'}),
      Factory.build('cell', {zone: 'z2'})
    ];
    desiredLrps = [
      Factory.build('desiredLrp', {process_guid: 'abc', routes: {}}),
      Factory.build('desiredLrp', {process_guid: 'xyz', routes: {}})
    ];
    actualLrps = [
      Factory.build('actualLrp', {cell_id: cells[0].cell_id, process_guid: 'abc'}),
      Factory.build('actualLrp', {cell_id: cells[1].cell_id, process_guid: 'abc'}),
      Factory.build('actualLrp', {cell_id: cells[1].cell_id, process_guid: 'xyz'})
    ];

    var ReceptorApi = require('../../../app/api/receptor_api');
    var CellsApi = require('../../../app/api/cells_api');
    spyOn(CellsApi, 'fetch').and.callThrough();
    var receptorPromise = new Deferred();
    spyOn(ReceptorApi, 'fetch').and.returnValue(receptorPromise);
    React.render(<Application {...props}/>, root);
    receptorPromise.resolve({actualLrps, cells, desiredLrps});
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('hovering over an lrp', function() {
    beforeEach(function() {
      $('.app-container:eq(0)').simulate('mouseOver');
      jasmine.clock().tick(1000);
    });

    it('highlights containers with the same desired lrp', function() {
      expect('.selection').toExist();
      expect('.app-container:eq(0)').toHaveCss({opacity: /^1/});
      expect('.app-container:eq(1)').toHaveCss({opacity: /^1/});
      expect('.app-container:eq(2)').toHaveCss({opacity: /^0\./});
    });
  });
});
