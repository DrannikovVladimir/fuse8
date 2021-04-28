const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: path.resolve(__dirname, './src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(scss|css)$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
        }),
    ],
    devServer: {
        contentBase: path.resolve(__dirname, './dist'),
        compress: true,
        port: 8080,
        open: true,
        hot: true,
    },
}