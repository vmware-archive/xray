var webpack = require('webpack');
module.exports = {
  plugins: [new webpack.optimize.UglifyJsPlugin({compress: {warnings: false}})]
};