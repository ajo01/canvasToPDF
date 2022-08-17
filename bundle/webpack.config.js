const webpack = require("webpack");
const path = require("path");
module.exports = {
  mode: "development",
  entry: "./index.js",
  output: {
    path: path.resolve(__dirname, "../npm/package"),
    filename: "canvasToPDF.js",
    libraryTarget: "umd",
    globalObject: "this",
  },
};
