require('../spec_helper');

describe('Cell', function() {
  var subject, cell;
  beforeEach(function() {
    var Cell = require('../../../app/components/cell');
    cell = Factory.build('cell');
    expect(cell.actual_lrps).not.toBeEmpty();
    subject = React.render(<Cell cell={cell}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders a cell', function() {
    expect($('.cell')).toExist();
  });

  it('renders actual lrps', function() {
    expect($('.cell .actual-lrp')).toHaveLength(cell.actual_lrps.length);
  });
});