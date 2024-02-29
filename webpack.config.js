const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: './src/_includes/scripts/index.js',
  devtool: "source-map",
  output: {
    path: path.resolve(__dirname, '_site'),
    filename: 'main.js',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  }
};