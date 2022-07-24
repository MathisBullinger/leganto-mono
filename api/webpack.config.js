const webpack = require('webpack')
const fs = require('fs')
const path = require('path')
const NodemonPlugin = require('nodemon-webpack-plugin')

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development'

  return {
    entry: './src/main.ts',
    ...(isDev && { devtool: 'source-map' }),
    mode: isDev ? 'development' : 'production',
    output: {
      path: path.join(__dirname, 'dist'),
      publicPath: '/',
      filename: '[name].js',
    },
    target: 'node',
    optimization: {
      minimize: isDev,
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
    externals: {
      knex: 'commonjs knex',
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
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          loader: 'graphql-tag/loader',
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin(
        fs.existsSync('.env')
          ? Object.fromEntries(
              fs
                .readFileSync('.env', 'utf-8')
                .split('\n')
                .filter(Boolean)
                .map(v => v.split('='))
                .map(([k, v]) => [`process.env.${k}`, JSON.stringify(v)])
            )
          : {}
      ),
      isDev && new NodemonPlugin(),
    ].filter(Boolean),
  }
}
