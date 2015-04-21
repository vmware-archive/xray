require('../spec_helper');

describe('Sidebar', function() {
  var Cursor, subject, $receptor, $sidebar, $selection, desiredLrps, actualLrps, callbackSpy;
  beforeEach(function() {
    var Sidebar = require('../../../app/components/sidebar');
    actualLrps = [
      Factory.build('actualLrp', {process_guid: 'Amazon'}),
      Factory.build('actualLrp', {process_guid: 'Diego'}),
      Factory.build('actualLrp', {process_guid: 'Diego'}),
      Factory.build('actualLrp', {process_guid: 'Diego', state: 'CLAIMED'})
    ];
    desiredLrps = [
      Factory.build('desiredLrp', {process_guid: 'Amazon', instances: 5}),
      Factory.build('desiredLrp', {process_guid: 'Diego', instances: 3})
    ];

    Cursor = require('pui-cursor');
    callbackSpy = jasmine.createSpy('callback');
    var actualLrpsByProcessGuid = {
      Amazon: [actualLrps[0]],
      Diego: [actualLrps[1], actualLrps[2], actualLrps[3]]
    };
    $receptor = new Cursor({desiredLrps, actualLrps, actualLrpsByProcessGuid}, callbackSpy);
    $selection = new Cursor({selectedDesiredLrp: null}, jasmine.createSpy('callback'));
    $sidebar = new Cursor({filter: '', sidebarCollapsed: false}, jasmine.createSpy('callback'));
    var colors = ['#fff', '#000'];
    React.withContext({colors}, function() {
      subject = React.render(<Sidebar {...{$receptor, $selection, $sidebar}}/>, root);
    });
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders desired lrps', function() {
    expect($('.media')).toHaveLength(desiredLrps.length);
  });

  it('renders the sidebar toggle', function() {
    expect('.sidebar-toggle').toExist();
  });

  it('displays the number of instances for a desired lrp', function() {
    expect('.desired-lrp:eq(0)').toContainText('1/5');
    expect('.desired-lrp:eq(1)').toContainText('2/3');
  });

  describe('when filtering', function() {
    describe('when there are filtered lrps', function() {
      beforeEach(function() {
        var filteredLrps = {Amazon: desiredLrps[0]};
        var $selection = new Cursor({filteredLrps}, jasmine.createSpy('callback'));
        var $sidebar = new Cursor({filter: 'mazon'}, jasmine.createSpy('callback'));
        subject.setProps({$selection, $sidebar});
      });

      it('renders the filtered lrps', function() {
        expect($('.desired-lrp:eq(0)')).toContainText('Amazon');
        expect($('.desired-lrp')).toHaveLength(1);
      });
    });

    describe('when there are no filtred lrps', function() {
      beforeEach(function() {
        var filteredLrps = {};
        var $selection = new Cursor({filteredLrps}, jasmine.createSpy('callback'));
        var $sidebar = new Cursor({filter: 'zzz'}, jasmine.createSpy('callback'));
        subject.setProps({$selection, $sidebar});
      });
      it('displays help text when there are no filtered results', function() {
        expect('.desired-lrp').not.toExist();
        expect('.sidebar').toContainText('No filtered processes found.');
      });
    });
  });
});