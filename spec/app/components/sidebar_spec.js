require('../spec_helper');

describe('Sidebar', function() {
  var subject, $receptor, desiredLrps;
  beforeEach(function() {
    var Sidebar = require('../../../app/components/sidebar');
    var actualLrps = [
      Factory.build('actualLrp', {process_guid: 'Amazon'}),
      Factory.build('actualLrp', {process_guid: 'Diego'}),
      Factory.build('actualLrp', {process_guid: 'Diego'}),
      Factory.build('actualLrp', {process_guid: 'Diego', state: 'CLAIMED'})
    ];
    desiredLrps = [
      Factory.build('desiredLrp', {process_guid: 'Amazon', instances: 5}),
      Factory.build('desiredLrp', {process_guid: 'Diego', instances: 3})
    ];

    var Cursor = require('../../../app/lib/cursor');
    $receptor = new Cursor({desiredLrps, actualLrps}, jasmine.createSpy('callback'));
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

  it('displays the number of instances for a desired lrp', function() {
    expect('.desired-lrp:eq(0)').toContainText('1/5');
    expect('.desired-lrp:eq(1)').toContainText('2/3');
  });
});