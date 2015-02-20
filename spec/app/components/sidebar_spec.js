require('../spec_helper');

describe('Sidebar', function() {
  var Cursor, subject, $receptor, desiredLrps, actualLrps, callbackSpy;
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

    Cursor = require('../../../app/lib/cursor');
    callbackSpy = jasmine.createSpy('callback');
    $receptor = new Cursor({desiredLrps, actualLrps, selectedDesiredLrp: null, filter: '', sidebarCollapsed: false}, callbackSpy);
    var colors = ['#fff', '#000'];
    React.withContext({colors}, function() {
      subject = React.render(<Sidebar {...{$receptor}}/>, root);
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
    it('filters even when a desired lrp has no routes', function() {
      expect(function() {
        subject.setProps({$receptor: new Cursor({desiredLrps: [Factory.build('desiredLrp', {routes: null})], actualLrps, filter: 'filter'}, jasmine.createSpy('callback'))});
      }).not.toThrow();
    });

    it('filters the desired lrps based on process guid', function() {
      var processGuidFilter = 'Ama';
      subject.setProps({$receptor: new Cursor({desiredLrps, actualLrps, filter: processGuidFilter}, jasmine.createSpy('callback'))});
      expect($('.desired-lrp').map(function() { return $('.process-guid', this).text()}).toArray()).toEqual(['Amazon'])
    });

    it('filters the desired lrps based on the routes hostnames', function() {
      var routeFilter = desiredLrps[0].routes['cf-router'][0].hostnames[0];
      subject.setProps({$receptor: new Cursor({desiredLrps, actualLrps, filter: routeFilter}, jasmine.createSpy('callback'))});
      expect($('.desired-lrp').map(function() { return $('.process-guid', this).text()}).toArray()).toEqual(['Amazon'])
    });

    it('displays help text when there are no filtered results', function() {
      subject.setProps({$receptor: new Cursor({desiredLrps, actualLrps, filter: 'ZZZZZZZZ!@$'}, jasmine.createSpy('callback'))});
      expect('.desired-lrp').not.toExist();
      expect('.sidebar').toContainText('No filtered processes found.');
    });
  });
});