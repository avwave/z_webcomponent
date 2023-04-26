const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');

module.exports = {
  "sourceType": "unambiguous",
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "chrome": 100
        }
      }
    ],
    "@babel/preset-react"
  ],
  "plugins": [
    // new NodePolyfillPlugin()
  ],
  "resolve":{
    "fallback": {
      "path": require.resolve('path-browserify/'),
      "buffer": require.resolve('buffer/'),
      "url": require.resolve("url"),
      "fs": require.resolve("graceful-fs"),
      "stream": require.resolve("stream-browserify"),
      "constants": false
    }
  }

}