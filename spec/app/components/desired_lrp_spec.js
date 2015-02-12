require('../spec_helper');

describe('DesiredLrp', function() {
  var subject, desiredLrp, actualLrps;
  beforeEach(function() {
    var DesiredLrp = require('../../../app/components/desired_lrp');

    actualLrps = [
      Factory.build('actualLrp', {process_guid: 'Diego'}),
      Factory.build('actualLrp', {process_guid: 'Diego'}),
      Factory.build('actualLrp', {process_guid: 'Diego', state: 'CLAIMED'})
    ];
    desiredLrp = Factory.build('desiredLrp', {process_guid: 'Diego', instances: 3});

    subject = React.render(<DesiredLrp {...{desiredLrp, actualLrps, containerColor: 'blue'}}/>, root);
  });

  describe('when everything is running smoothly', function() {
    beforeEach(function() {
      actualLrps = React.addons.update(actualLrps, {2: {$merge: {state: 'RUNNING'}}});
      subject.setProps({actualLrps});
    });

    it('does not show any errors', function() {
      expect($('.desired-lrp')).not.toHaveClass('bg-error-1');
    });
  });

  describe('when not all of the actualLrps are running', function() {
    it('marks the lrp with an error', function() {
      expect($('.desired-lrp')).toHaveClass('bg-error-1');
    });
  });
});