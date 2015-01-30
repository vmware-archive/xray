module.exports = {
  debug: true,
  devtool: 'eval',
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: '6to5-loader'}
    ]
  },
  output: {
    filename: 'application.js'
  },
  watch: true
};