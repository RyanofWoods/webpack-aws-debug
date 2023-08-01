module.exports = {
  mode: 'development',
  entry: './index.js',
  module: {
    rules: [
      {
        test: /\.mjs$/,
        resolve: {
          fullySpecified: false
        }
      },
    ],
  },
  optimization: {
    minimize: false,
  },
};
