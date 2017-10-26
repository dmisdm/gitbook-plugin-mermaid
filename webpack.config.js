const nodeExternals = require("webpack-node-externals");
const path = require("path");

module.exports = {
  entry: ["babel-polyfill", "./index.js"],
  target: "node",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index.js",
    libraryTarget: "commonjs"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.html$/,
        loader: "html-loader",
        options: {
          interpolate: true
        },
        exclude: /node_modules/
      }
    ]
  },
  externals: [nodeExternals()]
};
