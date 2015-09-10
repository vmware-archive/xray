require('../spec_helper');

describe('DesiredLrpInfo', function() {
  var subject;
  beforeEach(function() {
    var actualLrps = [
      Factory.build('actualLrp', {process_guid: 'Diego'}),
      Factory.build('actualLrp', {process_guid: 'Diego'}),
      Factory.build('actualLrp', {process_guid: 'Diego', state: 'CLAIMED'})
    ];
    var desiredLrp = Factory.build('desiredLrp', {process_guid: 'Diego', instances: 3});
    var DesiredLrpInfo = require('../../../app/components/desired_lrp_info');
    subject = React.render(<DesiredLrpInfo {...{actualLrps, desiredLrp}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders a desired lrp info', function() {
    expect('.desired-lrp-info').toExist();
  });

  describe('when the desired lrp has no hostnames', function() {
    it('does not throw an error', function() {
      expect(function() {
        var desiredLrp = Factory.build('desiredLrp', {process_guid: 'Diego', instances: 3, routes: {'cf-router': Factory.buildList('route', 1, {'hostnames': null})}});
        subject.setProps({desiredLrp});
      }).not.toThrow();
    });
  });
});