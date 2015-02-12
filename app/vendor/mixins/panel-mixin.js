'use strict';

var flatten = require('lodash.flatten');
var React = require('react');

var paddingTypes = flatten(['p', 'm'].map(function(type) {
  return ['l', 'r', 't', 'b', 'h', 'v', 'a'].map(function(loc) {
    return ['s', 'm', 'l', 'xl', 'xxl', 'xxxl', 'xxxxl'].map(function(size) {
      return '' + type + loc + size;
    });
  });
}));

var PanelMixin = {
  propTypes: {
    type: React.PropTypes.string,
    padding: function(props, propName, componentName) {
      if (props.padding) {
        props.padding.split(' ').forEach(function(pad) {
          if (!paddingTypes.includes(pad)) {
            return new Error('Invalid padding type used in ' + componentName);
          }
        });
      }
    },
    scrollable: React.PropTypes.oneOfType([
      React.PropTypes.bool,
      React.PropTypes.number
    ])
  }
};

module.exports = PanelMixin;
