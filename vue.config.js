const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = {
  configureWebpack: {
    resolve: {
      fallback: {
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        fs: false,
      },
    },
    plugins: [new NodePolyfillPlugin()],
  },
}
