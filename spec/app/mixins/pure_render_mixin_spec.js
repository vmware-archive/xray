describe('PureRenderMixin', function() {
  const data = {a: 'a', b: 'b'};
  var subject, one, two, three, nested, renderSpy, wrapper, Cursor;
  var update = React.addons.update;
  beforeEach(function() {
    var PureRenderMixin = require('../../../app/mixins/pure_render_mixin');
    renderSpy = jasmine.createSpy('render').and.returnValue(null);
    nested = { foo: 'bar'};
    one = {name: 'one', nested: nested};
    Cursor = require('../../../app/lib/cursor');
    two = new Cursor(data, jasmine.createSpy('callback'));
    three = {name: 'three'};
    wrapper = {one: one, two: two, three: three};

    var Klass = React.createClass({
      mixins: [PureRenderMixin],
      ignorePureRenderProps: ['ignore'],
      getInitialState(){ return {three}},
      render: renderSpy
    });
    React.withContext({}, function() {
      subject = React.render(<Klass one={wrapper.one} two={wrapper.two} ignore='me'/>, root);
      return subject;
    });
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
      describe('when the prop is not a cursor', function() {
        beforeEach(function() {
          subject.setProps({one});
        });

        it('does not re-render the component', function() {
          expect(renderSpy).not.toHaveBeenCalled();
        });
      });

      describe('when the prop is a cursor', function() {
        beforeEach(function() {
          subject.setProps({two: new Cursor(data, jasmine.createSpy('callback'))});
        });

        it('does not re-render the component', function() {
          expect(renderSpy).not.toHaveBeenCalled();
        });
      });
    });

    describe('when the prop should be ignored', function() {
      beforeEach(function() {
        subject.setProps({ignore: 'you'});
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