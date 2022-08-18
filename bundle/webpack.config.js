const webpack = require("webpack");
const path = require("path");

const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
  mode: "production",
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "../npm/package"),
    filename: "canvasToPDF.js",
    libraryTarget: "umd",
    globalObject: "this",
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
};
