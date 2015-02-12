module.exports = {
  devtool: 'source-map',
  entry: {
    application: `./app/components/application.js`
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /(?:node_modules|vendor)/, loader: '6to5-loader'},
      {test: /\/vendor\/.*\.js$/, exclude: /node_modules/, loader: 'jsx-loader?harmony'}
    ]
  },
  output: {
    filename: '[name].js'
  },
  watch: true
};