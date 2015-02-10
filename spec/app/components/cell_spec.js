require('../spec_helper');

describe('Cell', function() {
  var Cell, subject, cell, actualLrps, desiredLrps, update;
  function render(options) {
    var style = {width: '100px'};
    var subject;
    var colors = ['#fff', '#000'];
    React.withContext(Object.assign({colors}, options), function() {
      var props = {cell, style, desiredLrps, actualLrps};
      subject = React.render(<Cell {...props}/>, root);
    });
    return subject;
  }
  beforeEach(function() {
    update = React.addons.update;
    Cell = require('../../../app/components/cell');
    cell = Factory.build('cell', {capacity: {containers: 256, disk_mb: 1000, memory_mb: 100}});
    actualLrps = [
      Factory.build('actualLrp', {cell_id: cell.cell_id, process_guid: 'runtime', instance_guid: 'three'}),
      Factory.build('actualLrp', {cell_id: cell.cell_id, process_guid: 'diego', instance_guid: 'one'}),
      Factory.build('actualLrp', {cell_id: cell.cell_id, process_guid: 'google', instance_guid: 'two'})
    ];

    desiredLrps = [
      Factory.build('desiredLrp', {process_guid: 'runtime', disk_mb: 100, memory_mb: 25}),
      Factory.build('desiredLrp', {process_guid: 'diego', disk_mb: 300, memory_mb: 15}),
      Factory.build('desiredLrp', {process_guid: 'google', disk_mb: 200, memory_mb: 10})
    ];
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('with containers', function() {
    beforeEach(function() {
      subject = render({scaling: 'containers'});
    });

    it('renders actual lrps', function() {
      expect($('.cell .container')).toHaveLength(actualLrps.length);
    });

    it('sorts the actual lrps by process guid and index', function() {
      expect($('.container').map(function() { return $(this).data('instance-guid'); }).toArray()).toEqual(['one', 'two', 'three']);
    });

    describe('when an actualLrp does not have a desiredLrp', function() {
      beforeEach(function() {
        desiredLrps = update(desiredLrps, {$splice: [[1, 1]]});
        subject.setProps({desiredLrps});
      });

      it('gives it a special color', function() {
        expect('.container:eq(1)').not.toHaveClass(['flex', 'undesired']);
        expect('.container:eq(0)').not.toHaveClass('flex');
        expect('.container:eq(0)').toHaveClass('undesired');
        expect('.container:eq(0)').toHaveCss({'background-color': 'rgba(0, 0, 0, 0)'});
        expect('.container:eq(1)').not.toHaveClass(['flex', 'undesired']);
      });
    });
  });

  describe('with memory', function() {
    beforeEach(function() {
      subject = render({scaling: 'memory_mb'});
    });

    it('sets the width of each cell based on the scaling', function() {
      expect('.container:eq(0)').toHaveCss({width: "15px"});
      expect('.container:eq(1)').toHaveCss({width: "10px"});
      expect('.container:eq(2)').toHaveCss({width: "25px"});
    });

    describe('when the desired memory is zero', function() {
      beforeEach(function() {
        desiredLrps = update(desiredLrps, {2: {$merge: {process_guid: 'google', disk_mb: 200, memory_mb: 0}}});
        subject.setProps({desiredLrps});
      });

      it('fills the rest of the space', function() {
        expect('.container:eq(0)').not.toHaveClass('flex');
        expect('.container:eq(1)').toHaveClass('flex');
        expect('.container:eq(2)').not.toHaveClass('flex');
      });
    });

    describe('when an actualLrp does not have a desiredLrp', function() {
      beforeEach(function() {
        desiredLrps = update(desiredLrps, {$splice: [[1, 1]]});
        subject.setProps({desiredLrps});
      });

      it('gives it a special color', function() {
        expect('.container:eq(1)').not.toHaveClass(['flex', 'undesired']);
        expect('.container:eq(0)').not.toHaveClass('flex');
        expect('.container:eq(0)').toHaveClass('undesired');
        expect('.container:eq(0)').toHaveCss({'background-color': 'rgba(0, 0, 0, 0)'});
        expect('.container:eq(1)').not.toHaveClass(['flex', 'undesired']);
      });
    });
  });

  describe('with disk', function() {
    beforeEach(function() {
      subject = render({scaling: 'disk_mb'});
    });

    it('sets the width of each cell based on the scaling', function() {
      expect('.container:eq(0)').toHaveCss({width: "30px"});
      expect('.container:eq(1)').toHaveCss({width: "20px"});
      expect('.container:eq(2)').toHaveCss({width: "10px"});
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