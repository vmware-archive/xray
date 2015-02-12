module.exports = {
  devtool: 'source-map',
  entry: {
    application: `./app/components/application.js`
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: '6to5-loader?experimental=true'}
    ]
  },
  output: {
    filename: '[name].js'
  },
  watch: true
};