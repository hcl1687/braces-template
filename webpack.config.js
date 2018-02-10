module.exports = {
  entry: './src/index.js',
  output: {
    path: './',
    filename: 'index.js',
    library: 'braces',
    libraryTarget: 'umd'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loaders: ['babel-loader']
    }]
  }
}
