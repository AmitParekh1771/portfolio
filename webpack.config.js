const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: './src/main.js',
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