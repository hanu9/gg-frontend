const {resolve} = require("path");
var webpack = require("webpack");

module.exports = (env = {}) => {
    return {
        entry: {
            app: "./app" //application code
        },
        output:{
            path: resolve(__dirname, "public"),
            filename: "[name].[chunkhash].js"
        },
        context: resolve(__dirname, "client"),
        module:{
            rules: [
                {test: /\.js$/, use: ["babel-loader","eslint-loader"], exclude: /node_modules/}
            ]
        }
    }
}
