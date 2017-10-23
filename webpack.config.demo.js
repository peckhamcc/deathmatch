const webpack = require('webpack')
const config = require('./webpack.config.template.js')

config.plugins.push(new webpack.DefinePlugin({
  'process.env': {
    'NODE_ENV': '"DEMO"'
  }
}))

module.exports = config