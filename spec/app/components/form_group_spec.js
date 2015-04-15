require('../spec_helper');

describe('FormGroup', function() {
  var FormGroup, subject;
  function onValidate(input) {
    return input.value === 'Fuji';
  }

  beforeEach(function() {
    FormGroup = require('../../../app/components/form_group');

    subject = React.render(
      <FormGroup helpBlock="You are not in Japan!" onValidate={onValidate}>
        <input type="text"/>
      </FormGroup>
      , root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('when there is valid data', function() {
    beforeEach(function() {
      $('.form-group input').val('Fuji');
      subject.validate();
    });

    it('does not show errors', function() {
      expect('.has-error').not.toExist();
      expect('.form-group').not.toContainText('You are not in Japan!');
    });
  });

  describe('when there is invalid data', function() {
    beforeEach(function() {
      $('.form-group input').val('Whitney');
      subject.validate();
    });

    it('does not show errors', function() {
      expect('.form-group').toHaveClass('has-error');
      expect('.form-group').toContainText('You are not in Japan!');
    });
  });
});

