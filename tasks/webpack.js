/* eslint no-console: "off" */
const path = require ("path");
const webpack = require ("webpack");
const CleanWebpackPlugin = require ("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

let config = {
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  context: path.resolve(__dirname, "../"),
  entry: {index: [
    path.resolve("./src/index.js"),
    "webpack/hot/dev-server",
    "webpack-hot-middleware/client"
  ]},
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "../dist/")
  },
  module: {
    rules: [
      {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
        loader: "file-loader",
        options: {name: "font/[name].[ext]"}
      },
      {
        test: /\.(png|svg|jpg|gif|ico|jpeg)$/,
        loader: "file-loader",
        options: {name: "img/[name].[ext]"}
      },
      {
        test: /\.html$/,
        loader: "html-loader"
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader"
        ],
      },
      {
        test: /\.pug$/,
        loader: "pug-loader"
      },
      {
        test:  /\.s(a|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          "css-loader",
          "sass-loader"
        ]
      },
      {
        test: /\.jsx$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].style.css"
    }),
    new CleanWebpackPlugin([path.resolve(__dirname, "../dist/")], {
      root: path.resolve(__dirname, "../"),
    }),
    new webpack.ProvidePlugin({
      React: "react",
      ReactDOM: "react-dom",
      $: "jquery",
      jquery: "jquery",
      "window.jquery": "jquery",
      Popper: ["popper.js", "default"]
    })
  ]  
};

function scripts() {
  return new Promise(resolve => webpack(config, (err, stats) => {
    if (err) console.log("Webpack", err);
    console.log(stats.toString({ /* stats options */ }));
    resolve();
  }));
}

module.exports = { config, scripts };
