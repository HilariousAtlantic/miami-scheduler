const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    './app/index.js'
  ],

  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'public')
  },

  resolve: {
    modules: [
      path.resolve('./app'),
      path.resolve('./node_modules')
    ]
  },

  devtool: '#inline-source-map',

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          'babel-loader'
        ],
	exclude: /node_modules/
      },
      {
        test: /\.scss?$/,
        use: [
          'style-loader',
          'css-loader',
	  'sass-loader?includePaths[]=./node_modules'
	]
      },
      {
        test: /\.(png|jpg)?$/,
        use: 'file-loader',
        exclude: /node_modules/
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],

  devServer: {
    host: 'localhost',
    port: 8080,
    historyApiFallback: true,
    hot: true,
    compress: true,
    stats: {
      colors: true
    },
    contentBase: path.join(__dirname, 'public')
  }
}
