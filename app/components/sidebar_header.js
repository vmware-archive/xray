var React = require('react/addons');

var types = React.PropTypes;

var SidebarHeader = React.createClass({
  propTypes: {
    $filter: types.object.isRequired
  },

  change(e) {
    this.props.$filter.set(e.target.value);
  },

  render() {
    var value = this.props.$filter.get();
    return (
      <header className="sidebar-header mam">
        <input className="form-control" type="text" placeholder="Filter processes&hellip;" value={value} onChange={this.change}/>
      </header>
    );
  }
});

module.exports = SidebarHeader;