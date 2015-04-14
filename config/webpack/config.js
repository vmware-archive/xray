var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var commonsChunkPlugin = new CommonsChunkPlugin({
  name: 'common',
  filename: 'common.js'
});

module.exports = function(env = null) {
  return Object.assign({}, {
    entry: {
      application: './app/components/application.js',
      setup: './app/components/setup.js'
    },
    module: {
      loaders: [
        {test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?optional[]=es7.objectRestSpread&optional[]=regenerator'}
      ]
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[id].js',
      pathinfo: true
    },
    plugins: [commonsChunkPlugin]
  }, env && require(`./${env}`));
};