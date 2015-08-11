require('../spec_helper');

describe('features.filtering', function() {
  const RECEPTOR_URL = 'http://example.com';
  var Application, cells, desiredLrps, actualLrps;
  beforeEach(function() {
    Application = require('../../../app/components/application');
    var props = {config: {receptorUrl: RECEPTOR_URL, colors: ['#fff', '#000']}};
    cells = Factory.buildList('cell', 2);
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

  it('does not have any filtered components', function() {
    expect('.selection').not.toExist();
    expect('.selected').not.toExist();
  });

  describe('when filtering', function() {
    beforeEach(function() {
      $('.sidebar-header :text').val('bc').simulate('change');
    });

    it('filters the desired lrps in the sidebar', function() {
      expect('.sidebar').toContainText('abc');
      expect('.sidebar').not.toContainText('xyz');
    });

    it('dims the filtered out lrps', function() {
      expect('.app-container:eq(2)').toHaveCss({opacity: /^0\./});
    });

    xit('does not dim the non-filtered lrps', function() {
      expect('.app-container:eq(0)').toHaveCss({opacity: /^1/});
      expect('.app-container:eq(1)').toHaveCss({opacity: /^1/});
    });
  });
});