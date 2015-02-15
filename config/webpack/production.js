module.exports = {
  entry: {
    application: './app/components/application.js'
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?experimental=true'}
    ]
  },
  output: {
    filename: '[name].js'
  }
};