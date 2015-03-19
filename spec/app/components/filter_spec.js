require('../spec_helper');

describe('Filter', function() {
  const className = 'filter-class';
  const id = 'filter_id';
  const style = {color: 'red'};
  const value = 'filter';
  var subject, filterSpy;

  beforeEach(function() {
    var Filter = require('../../../app/components/filter');
    filterSpy = jasmine.createSpy('filter');

    subject = React.render(<Filter {...{className, id, style, value, onFilter: filterSpy}}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  it('renders a form control', function() {
    expect('.form-control').toExist();
  });

  it('sets the classname from props', function() {
    expect(subject.getDOMNode()).toHaveClass(className);
  });

  it('sets the id from props', function() {
    expect(subject.getDOMNode()).toHaveAttr('id', id);
  });

  it('sets the style from props', function() {
    expect(subject.getDOMNode()).toHaveAttr('style', 'color:red;');
  });

  describe('when the form control is changed', function() {
    const newFilter = 'another filter';
    beforeEach(function() {
      $('.form-control').simulate('change', {value: newFilter});
    });

    it('calls the onFilter callback', function() {
      expect(filterSpy).toHaveBeenCalled();
      expect(filterSpy.calls.mostRecent().args[0].value).toEqual(newFilter);
    });
  });
});
