require('../spec_helper');

describe('SidebarContainer', function() {
  var subject;

  beforeEach(function() {
    var SidebarContainer = require('../../../app/components/sidebar_container');
    var desiredLrp = Factory.build('desiredLrp');
    var props = {desiredLrp, instancesError: false};
    subject = withContext(
      {colors: ['#fff']},
      props,
      function() {
        return (<SidebarContainer {...this.props}/>);
      },
      root
    );
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders a container', function() {
    expect('.app-container-sidebar').toExist();
  });

  it('does not add the claimed class to the container', function() {
    expect('.app-container-sidebar').not.toHaveClass('claimed');
  });


  describe('when the claimed state is true', function() {
    beforeEach(function() {
      subject.setProps({claimed: true});
    });

    it('adds the claimed class to the container', function() {
      expect('.app-container-sidebar').toHaveClass('claimed');
    });
  });
});

