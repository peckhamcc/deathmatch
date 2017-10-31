const webpack = require('webpack')
const config = require('./webpack.config.template.js')
const CopyWebpackPlugin = require('copy-webpack-plugin')

config.plugins.push(new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': '"production"'
  }
}))

config.plugins.push(new CopyWebpackPlugin([{
  from: 'photos',
  to: 'photos',
  ignore: ['*.pxm', '.gitignore']
}]))

module.exports = config
