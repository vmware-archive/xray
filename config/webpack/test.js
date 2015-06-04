module.exports = {
  devtool: 'eval',
  entry: {
    spec: `./spec/spec.js`
  },
  plugins: null,
  resolve: {
    alias: {
      'lodash.throttle': `${__dirname}/../../spec/support/mock_throttle.js`
    }
  },
  quiet: true,
  watch: true
};