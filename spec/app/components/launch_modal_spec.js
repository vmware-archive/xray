require('../spec_helper');

describe('LaunchModal', function() {
  const receptorUrl = 'http://receptor.example.com/';

  function render(props) {
    var LaunchModal = require('../../../app/components/launch_modal');
    var {PortalOrange} = require('../../../app/components/portals');
    React.render((
      <div>
        <LaunchModal title="Launch X-Ray" {...props}>Launch X-ray</LaunchModal>
        <PortalOrange name="modal"/>
      </div>
    ), root);
  }


  beforeEach(function() {
    render({receptorUrl: ''});
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('when the modal button is clicked', function() {
    beforeEach(function() {
      $('button:contains("Launch X-ray")').simulate('click');
    });

    it('disables the launch x-ray button', function() {
      expect('.launch-modal :submit:disabled').toExist();
    });

    it('posts the right data to setup when the form is submitted', function() {
      expect('form').toHaveAttr('method', 'POST');
      expect('form').toHaveAttr('action', '/setup');
      expect('#user').toHaveAttr('name', 'user');
      expect('#password').toHaveAttr('name', 'password');
      expect('#receptor-url').toHaveAttr('name', 'receptor_url');
    });

    describe('when filling in the receptor url', function() {
      it('enables the launch x-ray button', function() {
        $('#receptor-url').val('http://example.com').simulate('change');
        expect('.launch-modal :submit:disabled').not.toExist();
      });
    });

    describe('when clicking on the close button', function() {
      beforeEach(function() {
        $('.modal-footer button:contains("Close")').simulate('click');
      });

      it('calls close modal', function() {
        expect('.modal-dialog').not.toExist();
      });
    });

    describe('when there is a receptor url', function() {
      describe('when the url does not have a user and password', function() {
        beforeEach(function() {
          React.unmountComponentAtNode(root);
          render({receptorUrl});
          $('button:contains("Launch X-ray")').simulate('click');
        });

        it('pre-fills the receptor input', function() {
          expect('#receptor-url').toHaveValue(receptorUrl);
        });
      });

      describe('when the url has a user and password', function() {
        const user = 'username';
        const password = 'password';
        const receptorUrlWithBasicAuth = `http://${user}:${password}@receptor.example.com/`;
        beforeEach(function() {
          React.unmountComponentAtNode(root);
          render({receptorUrl: receptorUrlWithBasicAuth});
          $('button:contains("Launch X-ray")').simulate('click');
        });

        it('pre-fills the user and password', function() {
          expect('#user').toHaveValue(user);
          expect('#password').toHaveValue(password);
        });

        it('pre-fills the receptor input without the user and password', function() {
          expect('#receptor-url').toHaveValue(receptorUrl);
        });
      });
    });
  });
});