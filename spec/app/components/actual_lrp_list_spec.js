require('../spec_helper');

describe('ActualLrpList', function() {
  var actualLrps, subject;
  beforeEach(function() {
    var ActualLrpList = require('../../../app/components/actual_lrp_list');
    actualLrps = [
      Factory.build('actualLrp', {index: 0}),
      Factory.build('actualLrp', {index: 1}),
      Factory.build('actualLrp', {index: 2, state: 'CRASHED'})
    ]
    ;
    subject = React.render(<ActualLrpList {...{actualLrps}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders actual lrps', function() {
    expect('.actual-lrp').toHaveLength(actualLrps.length);
  });

  it('renders crashed lrps differently', function() {
    expect('.actual-lrp:eq(0)').not.toHaveClass('bg-error-1');
    expect('.actual-lrp:eq(2)').toHaveClass('bg-error-1');
  });
});