const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/index.js'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
  },
  mode,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.(scss|css)$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(ico)$/i,
        type: 'asset/resource',
        generator: {
          filename: '[name][ext]',
        },
      },
      {
        test: /\.(png|jpe?g|svg)$/i,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]',
        },
      },
      {
        test: /\.(woff|woff2)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name].[ext]',
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './src/index.html'),
      filename: 'index.html',
    }),
    new ImageMinimizerPlugin({
      minimizerOptions: {
        plugins: [
          ['jpegtran', { progressive: true }],
        ],
      },
    }),
    new ImageMinimizerPlugin({
      test: /\.(jpe?g)$/i,
      filename: 'images/[name].webp',
      minimizerOptions: {
        plugins: ['imagemin-webp'],
      },
    }),
  ],
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    compress: true,
    port: 8080,
    open: true,
    hot: true,
  },
};
