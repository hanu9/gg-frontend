const {resolve} = require("path");
const webpack = require("webpack");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const WebpackCleanupPlugin = require("webpack-cleanup-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const config = require('./server/config');

const extractSass = new ExtractTextPlugin({
    filename: "[name].[contenthash].css",
    disable: process.env.NODE_ENV === "development"
});

module.exports = (env = {}) => {
    return {
        entry: {
            vendor: ["react","react-dom","react-router","material-ui","redux","react-redux","react-router-redux","redux-thunk"],
            app: "./app" //application code
        },
        output:{
            path: resolve(__dirname, "public"),
            filename: "[name].[chunkhash].js",
            publicPath: config.host+"/"
        },
        context: resolve(__dirname, "client"),
        module:{
            rules: [
                {test: /\.js$/, use: ["babel-loader","eslint-loader"], exclude: /node_modules/},
                {test: /\.scss$/,use: extractSass.extract({
                        use: [{loader: "css-loader"}, {loader: "sass-loader"}],
                        // use style-loader in development
                        fallback: "style-loader"
                    })
                }
            ]
        },
        plugins: [
            new CopyWebpackPlugin([
                { from: 'docs', to: 'docs' },
                { from: 'images', to: 'images' }
            ]),
            new WebpackCleanupPlugin(),
            extractSass,
            new HtmlWebpackPlugin({
                filename: resolve(__dirname,'server/views/index.html'),
                template: resolve(__dirname,'server/views/layout.html')
            })
        ]
    }
}
