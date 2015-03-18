require('../spec_helper');

describe('Cell', function() {
  var Cursor, Cell, subject, cell, actualLrps, desiredLrps, update, $receptor, $sidebar, $selection, callbackSpy, desiredLrpsByProcessGuid;
  function render(cellProps = {}, options = {}) {
    var style = {width: '100px'};
    var subject;
    var colors = ['#fff', '#000'];
    React.withContext(Object.assign({colors}, options), function() {
      var props = Object.assign({cell, style, actualLrps, $receptor, $sidebar, $selection}, cellProps);
      subject = React.render(<Cell {...props}/>, root);
    });
    return subject;
  }
  beforeEach(function() {
    Cursor = require('../../../app/lib/cursor');
    update = React.addons.update;
    Cell = require('../../../app/components/cell');
    cell = Factory.build('cell', {capacity: {containers: 256, disk_mb: 1000, memory_mb: 100}});
    actualLrps = [
      Factory.build('actualLrp', {cell_id: cell.cell_id, process_guid: 'diego', instance_guid: 'one'}),
      Factory.build('actualLrp', {cell_id: cell.cell_id, process_guid: 'google', instance_guid: 'two'}),
      Factory.build('actualLrp', {cell_id: cell.cell_id, process_guid: 'runtime', instance_guid: 'three'})
    ];

    desiredLrps = [
      Factory.build('desiredLrp', {process_guid: 'runtime', disk_mb: 100, memory_mb: 25}),
      Factory.build('desiredLrp', {process_guid: 'diego', disk_mb: 300, memory_mb: 15}),
      Factory.build('desiredLrp', {process_guid: 'google', disk_mb: 200, memory_mb: 10})
    ];
    desiredLrpsByProcessGuid = {
      runtime: desiredLrps[0],
      diego: desiredLrps[1],
      google: desiredLrps[2]
    };
    callbackSpy = jasmine.createSpy('callback');
    $receptor = new Cursor({desiredLrps, desiredLrpsByProcessGuid}, callbackSpy);
    $sidebar = new Cursor({}, callbackSpy);
    $selection = new Cursor({}, callbackSpy);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('with containers', function() {
    beforeEach(function() {
      subject = render({scaling: 'containers'});
    });

    it('renders actual lrps', function() {
      expect('.cell .app-container').toHaveLength(actualLrps.length);
      expect('.cell .app-container:eq(0)').toHaveClass(`app-${actualLrps[0].process_guid}`);
      expect('.cell .app-container:eq(1)').toHaveClass(`app-${actualLrps[1].process_guid}`);
      expect('.cell .app-container:eq(2)').toHaveClass(`app-${actualLrps[2].process_guid}`);
    });

    it('sorts the actual lrps by process guid and index', function() {
      expect($('.app-container').map(function() { return $(this).data('instance-guid'); }).toArray()).toEqual(['one', 'two', 'three']);
    });

    describe('when an actualLrp does not have a desiredLrp', function() {
      beforeEach(function() {
        desiredLrps = update(desiredLrps, {$splice: [[1, 1]]});
        $receptor = new Cursor({desiredLrps}, jasmine.createSpy('callback'));
        subject.setProps({$receptor});
      });

      it('gives it a special color', function() {
        expect('.app-container:eq(1)').not.toHaveClass(['flex', 'undesired']);
        expect('.app-container:eq(0)').not.toHaveClass('flex');
        expect('.app-container:eq(0)').toHaveClass('undesired');
        expect('.app-container:eq(0)').toHaveCss({'background-color': 'rgba(0, 0, 0, 0)'});
        expect('.app-container:eq(1)').not.toHaveClass(['flex', 'undesired']);
      });

      it('does not crash if there is a selectedDesiredLrp', function() {
        $receptor = new Cursor({desiredLrps, selectedDesiredLrp: Factory.build('desiredLrp')}, jasmine.createSpy('callback'));
        expect(() => subject.setProps({$receptor})).not.toThrow();
      });
    });

    it('deals with selecting lrps', function() {
      $('.app-container:eq(0)').simulate('click');
      expect(callbackSpy).toHaveBeenCalledWith(jasmine.objectContaining({selectedDesiredLrp: desiredLrps[1]}));
    });
  });

  describe('with memory', function() {
    beforeEach(function() {
      subject = render({scaling: 'memory_mb'});
    });

    it('sets the width of each cell based on the scaling', function() {
      expect('.app-container:eq(0)').toHaveCss({width: '15px'});
      expect('.app-container:eq(1)').toHaveCss({width: '10px'});
      expect('.app-container:eq(2)').toHaveCss({width: '25px'});
    });

    describe('when the desired memory is zero', function() {
      beforeEach(function() {
        var change = {process_guid: 'google', disk_mb: 200, memory_mb: 0};
        desiredLrps = update(desiredLrps, {2: {$merge: change}});
        desiredLrpsByProcessGuid = update(desiredLrpsByProcessGuid, {google: {$merge: change}});

        $receptor = new Cursor({desiredLrps, desiredLrpsByProcessGuid}, jasmine.createSpy('callback'));
        subject.setProps({$receptor});
      });

      it('fills the rest of the space', function() {
        expect('.app-container:eq(0)').not.toHaveClass('flex');
        expect('.app-container:eq(1)').toHaveClass('flex');
        expect('.app-container:eq(2)').not.toHaveClass('flex');
      });
    });

    describe('when an actualLrp does not have a desiredLrp', function() {
      beforeEach(function() {
        desiredLrps = update(desiredLrps, {$splice: [[1, 1]]});
        $receptor = new Cursor({desiredLrps}, jasmine.createSpy('callback'));
        subject.setProps({$receptor});
      });

      it('gives it a special color', function() {
        expect('.app-container:eq(1)').not.toHaveClass(['flex', 'undesired']);
        expect('.app-container:eq(0)').not.toHaveClass('flex');
        expect('.app-container:eq(0)').toHaveClass('undesired');
        expect('.app-container:eq(0)').toHaveCss({'background-color': 'rgba(0, 0, 0, 0)'});
        expect('.app-container:eq(1)').not.toHaveClass(['flex', 'undesired']);
      });
    });
  });

  describe('with disk', function() {
    beforeEach(function() {
      subject = render({scaling: 'disk_mb'});
    });

    it('sets the width of each cell based on the scaling', function() {
      expect('.app-container:eq(0)').toHaveCss({width: '30px'});
      expect('.app-container:eq(1)').toHaveCss({width: '20px'});
      expect('.app-container:eq(2)').toHaveCss({width: '10px'});
    });
  });

  describe('with no desired lrps', function() {
    beforeEach(function() {
      subject = render({scaling: 'containers'}, {desiredLrps: null});
    });
    it('renders actual lrps at container scaling', function() {
      expect('.app-container:eq(0)').toHaveCss({width: '2px'});
      expect('.app-container:eq(1)').toHaveCss({width: '2px'});
      expect('.app-container:eq(2)').toHaveCss({width: '2px'});
    });
  });
});