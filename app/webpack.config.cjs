const path = require("path");
const copy = require("copy-webpack-plugin");
const webpack = require("webpack");

module.exports = (env) => {

  const isDevelopment = process.argv[process.argv.indexOf("--mode") + 1] === "development";
  const dotenvFilename = isDevelopment ? '/.env.development' : '/.env.production';

  const dotenv = require("dotenv").config({ path: __dirname + dotenvFilename });

  return {
    target: ["web", "es5"],
    entry: "./src/main.tsx",
    output: {
      filename: "[name].bundle.js",
      path: __dirname + "/public/assets/",
      publicPath: isDevelopment ? "/assets/" : undefined,
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          enforce: "pre",
            use: [
                {
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve('./ts.config.json'),
                    },
                },
            , "source-map-loader"],
        },
        {
          test: /\.c?js$/,
          enforce: "pre",
          use: ["source-map-loader"],
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    resolve: {
      fallback: {
        path: false,
        crypto: false,
        os: false,
      },
      extensions: [".ts", ".tsx", ".js"],
    },
    plugins: [
      new webpack.DefinePlugin({
        "process.env": JSON.stringify(dotenv.parsed),
      }),
      new copy({
        patterns: [{ from: "node_modules/@tripetto/builder/fonts/", to: "." }],
      })
    ],
    performance: {
      hints: false,
    },
    devServer: {
      static: path.resolve(__dirname, "public"),
      port: 9000,
      host: "0.0.0.0",
      historyApiFallback: true,
    },
  }
};
