require('../spec_helper');

describe('Portals', function() {
  var PortalBlue, PortalOrange, Potato;
  beforeEach(function() {
    PortalBlue = require('../../../app/components/portals').PortalBlue;
    PortalOrange = require('../../../app/components/portals').PortalOrange;
    Potato = React.createClass({
      getInitialState() { return {}; },
      render() {
        var {cake} = this.state;
        return (<div className="potato">{cake ? 'cake is a lie' : 'Potato'}</div>);
      }
    });
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('when the portals are rendered blue first then orange', function() {
    var potato;
    beforeEach(function() {
      var Context = React.createClass({
        render() {
          return (
            <div>
              <div className="blue">
                <PortalBlue name="chell">
                  <Potato ref="potato"/>
                </PortalBlue>
              </div>
              <div className="orange">
                <PortalOrange name="chell"/>
              </div>
            </div>
          );
        }
      });
      var context = React.render(<Context/>, root);
      potato = context.refs.potato;
    });

    it('does not render the blue portal content', function() {
      expect('.blue').not.toHaveText('Potato');
    });

    it('renders the blue portal into the orange portal', function() {
      expect('.orange').toHaveText('Potato');
    });

    describe('when the blue contents change', function() {
      beforeEach(function() {
        potato.setState({cake: true});
      });

      it('updates in the orange portal', function() {
        expect('.orange').not.toHaveText('Potato');
        expect('.orange').toHaveText('cake is a lie');
      });
    });
  });

  describe('when the portals are render orange first then blue', function() {
    beforeEach(function() {
      React.render(
        <div>
          <div className="orange">
            <PortalOrange name="chell"/>
          </div>
          <div className="blue">
            <PortalBlue name="chell">
              <Potato/>
            </PortalBlue>
          </div>
        </div>,
        root);
    });

    it('does not render the blue portal content', function() {
      expect('.blue').not.toHaveText('Potato');
    });

    it('renders the blue portal into the orange portal', function() {
      expect('.orange').toHaveText('Potato');
    });
  });

  describe('with multiple portal pairs', function() {
    beforeEach(function() {
      React.render(
        <div>
          <div className="orange-chell">
            <PortalOrange name="chell"/>
          </div>
          <div className="blue-chell">
            <PortalBlue name="chell">
              <Potato/>
            </PortalBlue>
          </div>
          <div className="orange-wheatley">
            <PortalOrange name="wheatley"/>
          </div>
          <div className="blue-wheatley">
            <PortalBlue name="wheatley">
              <div>Okay don't panic! Alright? Stop panicking! I can still stop this. Ahh. Oh there's a password. It's fine. I'll just hack it. Not a problem... umm...</div>
            </PortalBlue>
          </div>
        </div>,
        root);
    });


    it('renders the blue portal contents in the correct orange portals', function() {
      expect('.orange-chell').toHaveText('Potato');
      expect('.orange-wheatley').toContainText('Stop panicking!');
    });
  });
});