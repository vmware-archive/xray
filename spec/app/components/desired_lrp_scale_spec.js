require('../spec_helper');
describe('DesiredLrpScale', function() {
  var desiredLrp;
  beforeEach(function() {
    desiredLrp = Factory.build('desiredLrp', {instances: 4});
    var DesiredLrpScale = require('../../../app/components/desired_lrp_scale');
    React.render(<DesiredLrpScale {...{desiredLrp}}/>, root);
  });

  it('has an input with the current number of instances', function() {
    expect('input[type=number]').toHaveValue('4');
  });

  it('calls Receptor api with the desired lrp and the number to scale to', function(){
    var DesiredLrpsApi = require('../../../app/api/desired_lrps_api');
    spyOn(DesiredLrpsApi, 'scale');
    $('input[type=number]').val(8).simulate('change');
    $('form').simulate('submit');
    expect(DesiredLrpsApi.scale).toHaveBeenCalledWith(desiredLrp, 8);
  });
});