require('../spec_helper');

describe('Cell', function() {
  var Cell, subject, cell, desiredLrps;
  function render(options) {
    var style = {width: 100};
    var subject;
    React.withContext(Object.assign({desiredLrps}, options), function() {
      subject = React.render(<Cell cell={cell} style={style}/>, root);
    });
    return subject;
  }
  beforeEach(function() {
    Cell = require('../../../app/components/cell');
    cell = Factory.build('cell', {Capacity: {containers: 256, disk_mb: 1000, memory_mb: 100}});
    expect(cell.actual_lrps).not.toBeEmpty();
    desiredLrps = Factory.buildList('desiredLrp', 3);
    cell.actual_lrps[0].process_guid = 'runtime';
    cell.actual_lrps[1].process_guid = 'diego';
    cell.actual_lrps[2].process_guid = 'google';
    desiredLrps[0] = Object.assign(desiredLrps[0], {process_guid: 'runtime', disk_mb: 100, memory_mb: 25});
    desiredLrps[1] = Object.assign(desiredLrps[1], {process_guid: 'diego', disk_mb: 300, memory_mb: 15});
    desiredLrps[2] = Object.assign(desiredLrps[2], {process_guid: 'google', disk_mb: 200, memory_mb: 10});
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('with containers', function() {
    beforeEach(function() {
      subject = render({scaling: 'containers'});
    });
    it('renders actual lrps', function() {
      expect($('.cell .container')).toHaveLength(cell.actual_lrps.length);
    });
  });

  describe('with memory', function() {
    beforeEach(function() {
      subject = render({scaling: 'memory_mb'});
    });

    it('sets the width of each cell based on the scaling', function() {
      expect('.container:eq(0)').toHaveCss({width: "25px"});
      expect('.container:eq(1)').toHaveCss({width: "15px"});
      expect('.container:eq(2)').toHaveCss({width: "10px"});
    });

    describe('when the desired memory is zero', function() {
      beforeEach(function() {
        desiredLrps[2] = Object.assign(desiredLrps[2], {process_guid: 'google', disk_mb: 200, memory_mb: 0});
        subject.setProps({desiredLrps});
      });

      it('fills the rest of the space', function() {
        expect('.container:eq(0)').not.toHaveClass('flex');
        expect('.container:eq(1)').not.toHaveClass('flex');
        expect('.container:eq(2)').toHaveClass('flex');
      });
    });

    describe('when an actualLrp does not have a desiredLrp', function() {
      beforeEach(function() {
        desiredLrps.splice(1, 1);
        subject.setProps({desiredLrps});
      });

      it('fills the rest of the space and gives it a special color', function() {
        expect('.container:eq(0)').not.toHaveClass(['flex', 'undesired']);
        expect('.container:eq(1)').toHaveClass(['flex', 'undesired']);
        expect('.container:eq(0)').not.toHaveClass(['flex', 'undesired']);
      });
    });
  });

  describe('with disk', function() {
    beforeEach(function() {
      subject = render({scaling: 'disk_mb'});
    });

    it('sets the width of each cell based on the scaling', function() {
      expect('.container:eq(0)').toHaveCss({width: "10px"});
      expect('.container:eq(1)').toHaveCss({width: "30px"});
      expect('.container:eq(2)').toHaveCss({width: "20px"});
    });
  });

  describe('with no desired lrps', function() {
    beforeEach(function() {
      subject = render({desiredLrps: null, scaling: 'containers'});
    });
    it('renders actual lrps at container scaling', function() {
      expect('.container:eq(0)').toHaveCss({width: "2px"});
      expect('.container:eq(1)').toHaveCss({width: "2px"});
      expect('.container:eq(2)').toHaveCss({width: "2px"});
    });
  });
});