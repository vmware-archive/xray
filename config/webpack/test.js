module.exports = {
  debug: true,
  devtool: 'eval',
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: '6to5-loader'}
    ]
  },
  output: {
    filename: 'spec.js'
  },
  quiet: true,
  watch: true
};