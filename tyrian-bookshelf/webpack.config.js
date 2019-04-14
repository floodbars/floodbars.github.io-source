const path = require("path");

module.exports = {
  mode: "production",
  entry: [
    "./src/index.js",
    "./src/tyrian-bookshelf.html"
  ],
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.(html)$/,
        use: {
          loader: "file-loader?name=[name].[ext]"
        }
      }
    ]
  }
};