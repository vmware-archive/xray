var CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var commonsChunkPlugin = new CommonsChunkPlugin({
  name: 'common',
  filename: 'common.js'
});
var uglifyPlugin = new UglifyJsPlugin({compress: {warnings: false}});

module.exports = {
  plugins: [commonsChunkPlugin, uglifyPlugin]
};