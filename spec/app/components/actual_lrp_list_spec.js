require('../spec_helper');

describe('ActualLrpList', function() {
  var actualLrps, subject;
  beforeEach(function() {
    var ActualLrpList = require('../../../app/components/actual_lrp_list');
    actualLrps = Factory.buildList('actualLrp', 3);
    subject = React.render(<ActualLrpList {...{actualLrps}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders actual lrps', function() {
    expect('.actual-lrp').toHaveLength(actualLrps.length);
  });
});