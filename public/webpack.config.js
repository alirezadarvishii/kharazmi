const path = require("path");

const config = {
  entry: {
    app: "./src/app.js",
  },
  output: {
    filename: "app.js",
    path: path.resolve(__dirname, "js"),
    clean: true,
  },
  rules: [
    {
      test: /\.css$/i,
      use: ["style-loader", "css-loader"],
    },
  ],
};

module.exports = (env, argv) => {
  return config;
};
