module.exports = {
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: '6to5-loader'}
    ]
  },
  output: {
    filename: 'application.js'
  }
};