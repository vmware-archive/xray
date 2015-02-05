describe('FastMixin', function() {
  var subject, one, two, three, nested, renderSpy, wrapper;
  var update = React.addons.update;
  beforeEach(function() {
    var FastMixin = require('../../../app/mixins/fast_mixin');
    renderSpy = jasmine.createSpy('render').and.returnValue(null);
    nested = { foo: 'bar'};
    one = {name: 'one', nested: nested};
    two = {name: 'two'};
    three = {name: 'three'};
    wrapper = {one: one, two: two, three: three};

    var Klass = React.createClass({
      mixins: [FastMixin],
      getInitialState(){ return {three}},
      render: renderSpy
    });

    subject = React.render(<Klass one={wrapper.one} two={wrapper.two}/>, root);
  });

  afterEach(function() {
    React.unmountComponentAtNode(root);
  });

  describe('when the props are changed', function() {
    beforeEach(function() {
      renderSpy.calls.reset();
    });
    describe('when the props are different', function() {
      beforeEach(function() {
        subject.setProps({one: update(one, {$set: {name: 'three'}})});
      });
      it('re-renders the component', function() {
        expect(renderSpy).toHaveBeenCalled();
      });
    });

    describe('when a nested key does not really change', function() {
      beforeEach(function() {
        wrapper = update(wrapper, {$merge: {one}});
        subject.setProps({one: wrapper.one});
      });
      it('re-renders the component', function() {
        expect(renderSpy).not.toHaveBeenCalled();
      });
    });

    describe('when the props are the same', function() {
      beforeEach(function() {
        subject.setProps({one});
      });
      it('does not re-render the component', function() {
        expect(renderSpy).not.toHaveBeenCalled();
      });
    });

    describe('when prop is removed', function() {
      beforeEach(function() {
        subject.setProps({one: undefined});
      });
      it('re-renders the component', function() {
        expect(renderSpy).toHaveBeenCalled();
      });
    });
  });

  describe('when the state changes', function() {
    beforeEach(function() {
      renderSpy.calls.reset();
    });
    describe('when the state is different', function() {
      beforeEach(function() {
        subject.setState({three: update(three, {$set: {name: 'four'}})});
      });
      it('re-renders the component', function() {
        expect(renderSpy).toHaveBeenCalled();
      });
    });

    describe('when the state is the same', function() {
      beforeEach(function() {
        subject.setState({three});
      });
      it('does not re-render the component', function() {
        expect(renderSpy).not.toHaveBeenCalled();
      });
    });

    describe('when state is removed', function() {
      beforeEach(function() {
        subject.setState({three: undefined});
      });
      it('re-renders the component', function() {
        expect(renderSpy).toHaveBeenCalled();
      });
    });
  });
});