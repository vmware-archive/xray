var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var commonsChunkPlugin = new CommonsChunkPlugin({
  name: 'common',
  filename: 'common.js'
});

module.exports = function(env = null) {
  return Object.assign({}, {
    entry: {
      application: './app/components/application.js',
      setup: './app/components/setup_middleware.js'
    },
    externals: {
      react: 'React',
      'react/addons': 'React'
    },
    module: {
      loaders: [
        {test: /\.js$/, exclude: [/node_modules/], loader: 'babel-loader'}
      ]
    },
    output: {
      filename: '[name].js',
      chunkFilename: '[id].js',
      pathinfo: true
    },
    plugins: [commonsChunkPlugin]
  }, env && require(`./webpack/${env}`));
};