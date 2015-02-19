require('../spec_helper');

describe('DesiredLrpDetail', function() {
  var ActualLrpList, DesiredLrp, Cursor, subject, actualLrps, desiredLrps, $receptor;
  beforeEach(function() {
    ActualLrpList = require('../../../app/components/actual_lrp_list');
    spyOn(ActualLrpList.type.prototype, 'render').and.callThrough();
    DesiredLrp = require('../../../app/components/desired_lrp');
    spyOn(DesiredLrp.type.prototype, 'render').and.callThrough();
    var DesiredLrpDetail = require('../../../app/components/desired_lrp_detail');
    actualLrps = [
      Factory.build('actualLrp', {process_guid: 'Amazon'}),
      Factory.build('actualLrp', {process_guid: 'Diego'}),
      Factory.build('actualLrp', {process_guid: 'Diego'}),
      Factory.build('actualLrp', {process_guid: 'Diego', state: 'CLAIMED'})
    ];
    var selectedDesiredLrp = Factory.build('desiredLrp', {process_guid: 'Amazon', instances: 5});
    desiredLrps = [
      selectedDesiredLrp,
      Factory.build('desiredLrp', {process_guid: 'Diego', instances: 3})
    ];

    Cursor = require('../../../app/lib/cursor');
    $receptor = new Cursor({desiredLrps, actualLrps, selectedDesiredLrp, filter: ''}, jasmine.createSpy('callback'));
    var colors = ['#fff', '#000'];

    React.withContext({colors}, function() {
      subject = React.render(<DesiredLrpDetail {...{$receptor}}/>, root);
    });
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders a desired lrp', function() {
    expect('.desired-lrp-detail').toExist();
    expect(DesiredLrp.type.prototype.render).toHaveBeenCalled();
  });

  it('renders the expected lrps count', function() {
    expect('.desired-lrp-detail').toContainText('1/5');
  });

  it('renders actual lrp list', function() {
    expect(ActualLrpList.type.prototype.render).toHaveBeenCalled();
  });

  describe('when the desiredLrp has been deleted', function() {
    var deletedLrp;
    beforeEach(function() {
      deletedLrp = Factory.build('desiredLrp', {process_guid: 'Heroku'});
      var data = $receptor.get();
      $receptor = new Cursor(Object.assign({}, data, {selectedDesiredLrp: deletedLrp}));
      subject.setProps({$receptor})
    });

    it('renders a header with the old data', function() {
      expect('.desired-lrp-detail').toContainText('Heroku')
    });

    it('renders a message instead of the actual lrps', function() {
      expect('.desired-lrp-detail').toContainText('This process has been deleted');
    });
  });
});
