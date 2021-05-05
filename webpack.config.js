const dotenv = require("dotenv");
const config = require('./gulp.config');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require("path");
const webpack = require('webpack');

dotenv.config();
const outDir = config.buildDir;
console.log(`Build files are being created here: ${path.resolve(outDir)}`);

module.exports = {
    entry: {
        index: ["./src/sass/main.scss", "./src/index.tsx"]
    },
    output: {
        path: path.resolve(outDir, "public"),
        filename: "[name].[chunkhash].js",
        publicPath: ""
    },
    devServer: {
        contentBase: outDir,
        compress: true,
        port: 3001,
    },
    module: {
        rules: [{
                test: /\.(?:tsx|ts)$/,
                loader: "ts-loader",
                exclude: /node_modules/,
                options: {
                    transpileOnly: true
                }
            },
            {
                test: /\.js$/,
                use: ["source-map-loader"],
                enforce: "pre"
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: {
                        minimize: false
                    }
                }],
                exclude: /node_modules/
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "resolve-url-loader",
                        options: {
                            includeRoot: true
                        }
                    },
                    "sass-loader?sourceMap"
                ]
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve("url-loader"),
                options: {
                    limit: 10000,
                    name: `static/media/[name].[hash:8].[ext]`
                },
            },
            {
                test: [/\.eot$/, /\.ttf$/, /\.svg$/, /\.woff$/, /\.woff2$/],
                loader: require.resolve("file-loader"),
                options: {
                    name: `static/media/[name].[hash:8].[ext]`,
                },
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.svg$/,
                loader: 'svg-sprite-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [

        new CopyPlugin(
            [{
                from: path.resolve("src", "assets", "images"),
                to: path.resolve(outDir, "public", "images"),
                force: true
            }]
        ),

        new HtmlWebPackPlugin({
            title: 'ReactMap',
            template: './src/index.ejs',
            filename: './index.html',
            favicon: "./src/assets/favicon.ico",
            chunksSortMode: 'none',
            inlineSource: '.(css)$'
        }),

        new MiniCssExtractPlugin({
            filename: "[name].[chunkhash].css",
            chunkFilename: "[id].css"
        })

    ],
    resolve: {
        modules: [
            path.resolve(__dirname, "/src"),
            path.resolve(__dirname, "node_modules/")
        ],
        extensions: [".ts", ".tsx", ".js", ".scss", ".css"]
    },
    node: {
        process: false,
        global: false,
        fs: "empty"
    }
};