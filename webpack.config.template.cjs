const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const postcssPresetEnv = require('postcss-preset-env')

const paths = {
  // Source files
  src: path.resolve(__dirname, './src'),

  // Production build files
  build: path.resolve(__dirname, './dist'),

  // Static files that get copied to build folder
  public: path.resolve(__dirname, './public')
}

module.exports = {
  entry: {
    app: './src/index'
  },
  output: {
    path: paths.build,
    filename: '[name].js',
    publicPath: '/deathmatch/'
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.template.html'
    })
  ],
  resolve: {
    modules: [paths.src, 'node_modules'],
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': paths.src
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader', {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  postcssPresetEnv(/* pluginOptions */)
                ]
              }
            }
          }]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ]
          }
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader', {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true, // webpack@1.x
              query: {
                mozjpeg: {
                  progressive: true
                },
                gifsicle: {
                  interlaced: true
                },
                optipng: {
                  optimizationLevel: 7
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(ttf|eot|svg|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: 'fonts/[name]-[hash].[ext]'
          }
        }]
      },
      {
        test: /\.(wav|mp3)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name]-bundle-[hash].[ext]'
          }
        }]
      },
      {
        test: /\.json$/,
        use: [
          'json'
        ]
      }
    ]
  }
}
