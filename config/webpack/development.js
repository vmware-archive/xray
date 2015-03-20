module.exports = {
  devtool: 'eval',
  entry: {
    application: `./app/components/application.js`
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?optional[]=es7.objectRestSpread&optional[]=regenerator'}
    ]
  },
  output: {
    filename: '[name].js'
  },
  watch: true
};