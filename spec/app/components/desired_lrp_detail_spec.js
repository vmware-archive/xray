require('../spec_helper');

describe('DesiredLrpDetail', function() {
  var ActualLrpList, DesiredLrp, Cursor, subject, actualLrps, desiredLrps, $receptor, $selection;
  beforeEach(function() {
    ActualLrpList = require('../../../app/components/actual_lrp_list');
    spyOn(ActualLrpList.prototype, 'render').and.callThrough();
    DesiredLrp = require('../../../app/components/desired_lrp');
    spyOn(DesiredLrp.prototype, 'render').and.callThrough();
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

    Cursor = require('pui-cursor');
    var actualLrpsByProcessGuid = {
      Amazon: [actualLrps[0]],
      Diego: [actualLrps[1], actualLrps[2], actualLrps[3]]
    };
    $receptor = new Cursor({desiredLrps, actualLrps, actualLrpsByProcessGuid}, jasmine.createSpy('callback'));
    $selection = new Cursor({selectedDesiredLrp}, jasmine.createSpy('callback'));
    var $sidebar = new Cursor({}, jasmine.createSpy('callback'));
    var colors = ['#fff', '#000'];

    var props = {$receptor, $selection, $sidebar};
    subject = withContext(
      {colors},
      props,
      function() {
        return (<DesiredLrpDetail {...this.props}/>);
      },
      root
    );
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders a desired lrp', function() {
    expect('.desired-lrp-detail').toExist();
    expect(DesiredLrp.prototype.render).toHaveBeenCalled();
  });

  it('renders the expected lrps count', function() {
    expect('.desired-lrp-detail').toContainText('1/5');
  });

  it('renders actual lrp list', function() {
    expect(ActualLrpList.prototype.render).toHaveBeenCalled();
  });

  describe('when the desiredLrp has been deleted', function() {
    var deletedLrp;
    beforeEach(function() {
      deletedLrp = Factory.build('desiredLrp', {process_guid: 'Heroku'});
      $selection = new Cursor({selectedDesiredLrp: deletedLrp});
      subject.setProps({$selection});
    });

    it('renders a header with the old data', function() {
      expect('.desired-lrp-detail').toContainText('Heroku');
    });

    it('renders a message instead of the actual lrps', function() {
      expect('.desired-lrp-detail').toContainText('This process has been deleted');
    });
  });
});
