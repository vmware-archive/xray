module.exports = {
  devtool: 'inline-source-map',
  entry: {
    application: './app/components/application.js'
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: '6to5-loader'}
    ]
  },
  output: {
    filename: '[name].js'
  }
};