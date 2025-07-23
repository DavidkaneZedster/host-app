const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.config.cjs');

module.exports = merge(common, {
  mode: 'development',
  entry: './src/main.tsx',
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist/app'),
    module: true,
    environment: {
      module: true,
    },
  },
  experiments: {
    outputModule: true,
  },
  externalsType: 'module',
  externals: {
    'my-lib': 'http://localhost:8080/lib.js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
      scriptLoading: 'module',
    }),
  ],
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true,
  },
});
