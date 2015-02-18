require('../spec_helper');

describe('DesiredLrpDetail', function() {
  var DesiredLrp, Cursor, subject, actualLrps, desiredLrps, $receptor;
  beforeEach(function() {
    DesiredLrp = require('../../../app/components/desired_lrp');
    spyOn(DesiredLrp.type.prototype, 'render').and.callThrough();
    var DesiredLrpDetail = require('../../../app/components/desired_lrp_detail');
    actualLrps = [
      Factory.build('actualLrp', {process_guid: 'Amazon'}),
      Factory.build('actualLrp', {process_guid: 'Diego'}),
      Factory.build('actualLrp', {process_guid: 'Diego'}),
      Factory.build('actualLrp', {process_guid: 'Diego', state: 'CLAIMED'})
    ];
    var selectedLrp = Factory.build('desiredLrp', {process_guid: 'Amazon', instances: 5});
    desiredLrps = [
      selectedLrp,
      Factory.build('desiredLrp', {process_guid: 'Diego', instances: 3})
    ];

    Cursor = require('../../../app/lib/cursor');
    $receptor = new Cursor({desiredLrps, actualLrps, selectedLrp, filter: ''}, jasmine.createSpy('callback'));
    var colors = ['#fff', '#000'];

    React.withContext({colors}, function() {
      subject = React.render(<DesiredLrpDetail {...{$receptor}}/>, root);
    });
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders a desired lrp', function() {
    expect('.detail').toExist();
    expect(DesiredLrp.type.prototype.render).toHaveBeenCalled();
  });

  it('renders the expected lrps count', function() {
    expect('.detail').toContainText('1/5');
  });
});
