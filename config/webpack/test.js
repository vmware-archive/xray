module.exports = {
  devtool: 'eval',
  entry: {
    spec: `./spec/spec.js`
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: '6to5-loader'}
    ]
  },
  output: {
    filename: '[name].js'
  },
  quiet: false,
  watch: true
};