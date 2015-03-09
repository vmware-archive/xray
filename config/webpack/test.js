module.exports = {
  devtool: 'eval',
  entry: {
    spec: `./spec/spec.js`
  },
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?experimental=true'}
    ]
  },
  output: {
    filename: '[name].js'
  },
  quiet: true,
  watch: true
};