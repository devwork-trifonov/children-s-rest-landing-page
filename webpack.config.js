const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const path = require("path")

module.exports = ({ NODE_ENV }) => {
  const isDev = NODE_ENV !== "production"
  const isProd = !isDev
  const filename = (ext) =>
    isDev ? `[name].${ext}` : `[name].[contenthash].${ext}`

  return {
    entry: path.resolve(__dirname, "./src/js/app.js"),
    output: {
      filename: `js/${filename("js")}`,
      path: path.resolve(__dirname, "dist"),
    },
    target: isDev ? "web" : "browserslist",
    devServer: {
      contentBase: path.resolve(__dirname, "src"),
      watchContentBase: true,
      compress: true,
      port: 9000,
      open: false,
      historyApiFallback: true,
      stats: "normal",
      watchOptions: {
        poll: true,
        ignored: "/node_modules/",
      },
    },
    devtool: "source-map",
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "src/index.html"),
        cache: false,
        minify: isProd,
      }),
      new MiniCssExtractPlugin({
        filename: `css/${filename("css")}`,
        chunkFilename: isDev ? "css/[id].css" : "css/[id].[contenthash].css",
      }),
      new CleanWebpackPlugin(),
    ],
    optimization: {
      minimizer: [
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              "default",
              {
                discardComments: { removeAll: true },
              },
            ],
          },
        }),
      ],
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          include: path.resolve(__dirname, "./src/js"),
          use: {
            loader: "babel-loader",
            options: {
              presets: [["@babel/preset-env", { targets: { ie: "11" } }]],
            },
          },
        },
        {
          test: /\.html$/i,
          loader: "html-loader",
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: "../",
              },
            },
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: isProd ? ["autoprefixer"] : [],
                },
              },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
          generator: {
            filename: (pathData) => {
              const parsedFilename = path.parse(pathData.filename)
              const hash = pathData.contentHash
              parsedFilename.dir = parsedFilename.dir.replace("src/", "")
              const filename = `${parsedFilename.dir}/${hash}${parsedFilename.ext}`
              return filename
            },
          },
        },
      ],
    },
  }
}
