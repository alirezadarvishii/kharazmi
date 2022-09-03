const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const config = {
  entry: {
    app: "./src/js/app.js",
    dashboard: "./src/js/dashboard.js",
    gallery: "./src/js/gallery.js",
    login: "./src/js/login.js",
    me: "./src/js/me.js",
    siginup: "./src/js/signup.js",
    "form-control": "./src/js/form-control.js",
    "add-blog": "./src/js/add-blog.js",
    "manage-blogs": "./src/js/manage-blogs.js",
    "manage-events": "./src/js/manage-events.js",
    "manage-gallery": "./src/js/manage-gallery.js",
    "manage-users": "./src/js/manage-users.js",
    "single-blog": "./src/js/single-blog.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "js"),
    clean: true,
  },
  plugins: [new MiniCssExtractPlugin({ filename: "../styles/[name].css" })],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  "@babel/preset-env",
                  {
                    useBuiltIns: "usage",
                    corejs: "3.25",
                  },
                ],
              ],
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
        generator: {
          filename: "../images/[name][ext]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
        generator: {
          filename: "../fonts/[name][ext]",
        },
      },
    ],
  },
};

module.exports = (env, argv) => {
  config.mode = env.development ? "development" : "production";
  return config;
};
