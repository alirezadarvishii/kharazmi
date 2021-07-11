const path = require("path");

// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const TerserPlugin = require("terser-webpack-plugin");
// const postcssPresetEnv = require("postcss-preset-env");
// const cssnano = require("cssnano");

const configs = {
  entry: {
    app: "./src/js/app.js",
  },
  output: {
    path: path.join(__dirname, "dist"),
  },
  devServer: {
    contentBase: "./dist",
    port: 8585,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        loader: "babel-loader",
        options: {
          presets: [
            [
              "@babel/env",
              {
                useBuiltIns: "usage",
                corejs: {
                  version: 3,
                },
              },
            ],
          ],
        },
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "./fonts",
          publicPath: "../fonts",
        },
      },
      {
        test: /\.(png|jpg)$/i,
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "./images/",
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "./styles/[name]-[contenthash].css" }),
    new HtmlWebpackPlugin({
      template: "./src/templates/index.html",
      minify: false,
    }),
    new HtmlWebpackPlugin({
      filename: "teachers.html",
      template: "./src/templates/teachers.html",
      minify: false,
    }),
    new HtmlWebpackPlugin({
      filename: "single-blog.html",
      template: "./src/templates/single-blog.html",
      minify: false,
    }),
    new HtmlWebpackPlugin({
      filename: "login.html",
      template: "./src/templates/login.html",
      minify: false,
    }),
    new HtmlWebpackPlugin({
      filename: "signup.html",
      template: "./src/templates/signup.html",
      minify: false,
    }),
    new HtmlWebpackPlugin({
      filename: "about.html",
      template: "./src/templates/about.html",
      minify: false,
    }),
    new HtmlWebpackPlugin({
      filename: "blog.html",
      template: "./src/templates/blog.html",
      minify: false,
    }),
  ],
};

module.exports = (args, { mode }) => {
  if (mode === "development") {
    configs.output.filename = "./js/[name].js";
  } else if (mode === "production") {
    configs.output.filename = "./js/[name]-[contenthash].js";
  }
  return configs;
};
