var camelize = require('camelize');
var {Col, Row} = require('pui-react-grids');
var {Divider} = require('pui-react-dividers');
var {getCredentials} = require('../helpers/url_helper');
var {LowlightButton, HighlightButton} = require('pui-react-buttons');
var {Modal, ModalBody, ModalFooter} = require('pui-react-modals');
var {PortalSource} = require('./portals');
var PureRenderMixin = require('pui-cursor/mixins/pure-render-mixin');
var React = require('react');

var types = React.PropTypes;

var LaunchModal = React.createClass({
  mixins: [PureRenderMixin],

  propTypes: {
    receptorUrl: types.string,
    title: types.string
  },

  getInitialState() {
    var {receptorUrl: rawReceptorUrl = ''} = this.props;
    var {user, password, url: receptorUrl} = getCredentials(rawReceptorUrl);
    return {user, password, receptorUrl};
  },

  change({target: {value: value, name}}) {
    this.setState({[camelize(name)]: value});
  },

  openModal() {
    this.refs.modal.open();
  },

  closeModal() {
    this.refs.modal.close();
  },

  renderModal() {
    var {title} = this.props;
    var {password, receptorUrl, user} = this.state;
    var disabled = !receptorUrl.length;
    return (
      <Modal title={title} ref="modal">
        <form className="launch-modal" action="/setup" method="POST" role="form">
          <ModalBody>
            <p className="type-sm">If you are using Terraform to deploy Lattice, your username, password, and Receptor
              URL
              are printed when Lattice is successfully deployed.</p>

            <p className="type-sm">If you are using Vagrant, your Receptor URL is: <span className="em-high">http://receptor.192.168.11.11.xip.io</span>
            </p>

            <Divider/>
            <Row className="form-group">
              <Col md={12}>
                <label htmlFor="user">Username</label>
                <input type="text" className="form-control" name="user" id="user" placeholder="Username" value={user}
                       onChange={this.change}/>
              </Col>
              <Col md={12}>
                <label htmlFor="password">Password</label>
                <input type="password" className="form-control" name="password" id="password" placeholder="Password"
                       value={password} onChange={this.change}/>
              </Col>
            </Row>
            <Row className="form-group">
              <Col md={24}>
                <label htmlFor="receptor-url">Receptor Url</label>
                <input type="text" required={true} className="form-control" id="receptor-url" name="receptor_url"
                       placeholder="http://receptor.example.com" value={receptorUrl} onChange={this.change}/>
              </Col>
            </Row>
            <Divider/>
          </ModalBody>
          <ModalFooter>
            <LowlightButton type="button" onClick={this.closeModal}>Close</LowlightButton>
            <HighlightButton type="submit" disabled={disabled}>Launch X-Ray</HighlightButton>
          </ModalFooter>
        </form>
      </Modal>
    );
  },

  render() {
    return (
      <div className="mrxl">
        <HighlightButton onClick={this.openModal}>{this.props.children}</HighlightButton>
        <PortalSource name="modal">
          {this.renderModal()}
        </PortalSource>
      </div>
    );
  }
});

module.exports = LaunchModal;