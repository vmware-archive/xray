var React = require('react/addons');

var types = React.PropTypes;

var SidebarHeader = React.createClass({
  propTypes: {
    hasDetails: types.bool.isRequired,
    $filter: types.object.isRequired
  },

  change(e) {
    this.props.$filter.set(e.target.value);
  },

  render() {
    var {hasDetails, $filter} = this.props;
    var value = $filter.get();
    return (
      <header className="sidebar-header mam">
        {this.props.children}
        {!hasDetails && <div className="filter-processes">
          <input className="form-control" type="text" placeholder="Filter processes&hellip;" value={value} onChange={this.change}/>
        </div>}
      </header>
    );
  }
});

module.exports = SidebarHeader;