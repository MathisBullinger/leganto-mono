const slsw = require('serverless-webpack')
const webpack = require('webpack')
const fs = require('fs')
const path = require('path')

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  devtool: slsw.lib.webpack.isLocal ? 'source-map' : 'none',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  optimization: {
    minimize: !!slsw.lib.webpack.isLocal,
  },
  performance: {
    hints: false,
  },
  resolve: {
    mainFields: ['main', 'module'],
    extensions: ['.ts', '.js'],
    alias: {
      '~': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
}
