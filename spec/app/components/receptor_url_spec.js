require('../spec_helper');

describe('ReceptorUrl', function() {
  beforeEach(function() {
    var ReceptorUrl = require('../../../app/components/receptor_url');
    React.render(<ReceptorUrl receptorUrl="receptor.example.com"/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders the receptorUrl in a form', function() {
    expect('form[action="/setup"][method="POST"] input[name="receptor_url"]')
      .toHaveValue('receptor.example.com');
  });

  describe('editing the receptor url', function() {
    beforeEach(function() {
      $('[name="receptor_url"]').simulate('focus');
      jasmine.clock().tick(1);
    });

    it('selects contents of the input', function() {
      var input = $('[name="receptor_url"]').get(0);
      expect(input.value.slice(input.selectionStart, input.selectionEnd)).toBe('receptor.example.com');
    });

    it('validates the input', function() {
      $('[name="receptor_url"]').val('').simulate('change').simulate('submit');
      expect('.form-group').toHaveClass('has-error');
    });

    describe('when no longer editing', function() {
      var submitSpy;
      beforeEach(function() {
        submitSpy = spyOn(document.querySelector('form'), 'submit');
        $('body').on('submit', 'form', submitSpy);
      });

      describe('with a receptor url', function() {
        beforeEach(function() {
          $('[name="receptor_url"]').val('foo').simulate('change').simulate('blur');
        });

        it('submits the form', function() {
          expect(submitSpy).toHaveBeenCalled();
        });
      });

      describe('with the original receptor url', function() {
        beforeEach(function() {
          $('[name="receptor_url"]').simulate('blur');
        });

        it('does not submit the form', function() {
          expect(submitSpy).not.toHaveBeenCalled();
        });
      });

      describe('with no receptor url', function() {
        beforeEach(function() {
          $('[name="receptor_url"]').val('').simulate('change').simulate('blur');
        });

        it('does not submit the form', function() {
          expect(submitSpy).not.toHaveBeenCalled();
        });

        it('resets the input to the original receptor url', function() {
          expect('[name="receptor_url"]').toHaveValue('receptor.example.com');
        });
      });
    });
  });
});