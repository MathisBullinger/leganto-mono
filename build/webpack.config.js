const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { DefinePlugin } = require('webpack')
const path = require('path')
const fs = require('fs')

const baseDir = path.join(__dirname, '..')

module.exports = (_, argv) => {
  const IS_DEV = argv.mode === 'development'

  // text-replace any process.env.* variable at build time with the corresponding
  // value found in the .env file if it exists or otherwise with the environment
  // variable of the same name
  const dotEnvPath = path.join(baseDir, '.env')
  const dotEnv = fs.existsSync(dotEnvPath)
    ? Object.fromEntries(
        fs
          .readFileSync(dotEnvPath, 'utf-8')
          .split('\n')
          .filter(v => v.includes('='))
          .map(v => v.split('='))
      )
    : {}
  const env = Object.fromEntries(
    Object.entries({ ...process.env, ...dotEnv }).map(([k, v]) => [
      `process.env.${k}`,
      JSON.stringify(v),
    ])
  )

  return {
    mode: IS_DEV ? 'development' : 'production',
    entry: {
      app: path.join(baseDir, 'src/index.tsx'),
    },
    output: {
      filename: '[name].js',
      path: path.join(baseDir, 'dist'),
      publicPath: '/',
      clean: true,
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
      modules: [path.join(baseDir, 'src'), path.join(baseDir, 'node_modules')],
      alias: {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react/jsx-runtime': 'preact/jsx-runtime',
      },
    },
    devServer: {
      port: 3000,
      historyApiFallback: true,
    },
    ...(IS_DEV && { devtool: 'source-map' }),
    module: {
      rules: [
        {
          test: /\.(js|ts)x?$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.(sa|s?c)ss$/,
          use: [
            MiniCssExtractPlugin.loader,
            { loader: 'css-loader', options: { modules: true } },
            'sass-loader',
          ],
        },
        {
          test: /\.js$/,
          enforce: 'pre',
          use: ['source-map-loader'],
        },
        {
          test: /\.(graphql|gql)$/,
          exclude: /node_modules/,
          use: [
            path.resolve(__dirname, 'loaders/gql.js'),
            'graphql-tag/loader',
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(baseDir, 'index.html'),
      }),
      new MiniCssExtractPlugin(),
      new DefinePlugin(env),
    ],
  }
}
