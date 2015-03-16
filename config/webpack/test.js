module.exports = {
  devtool: 'eval',
  entry: {
    spec: `./spec/spec.js`
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?optional[]=es7.objectRestSpread&optional[]=regenerator'}
    ]
  },
  output: {
    filename: '[name].js'
  },
  quiet: true,
  watch: true
};