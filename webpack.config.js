const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const postCssPreset = require('postcss-preset-env');

const mode = process.env.NODE_ENV || 'development';
const isDevMode = mode === 'development';
const target = isDevMode ? 'web' : 'browserslist';
const devtool = isDevMode ? 'source-map' : undefined;

module.exports = {
    entry: ['@babel/polyfill', path.resolve(__dirname, 'src', 'index.js')],
    output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true,
        filename: 'main.[contenthash].js',
        assetModuleFilename: 'assets/[hash][ext]'
    },
    mode,
    target,
    devtool,
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, 'src', 'index.html')
        }),
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css'
        }),
    ],
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader'
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    isDevMode? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [postCssPreset]
                            }
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test: /\.(?:js|mjs|cjs)$/i,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-env', {targets: 'defaults'}]
                        ]
                    }
                }
            },
            {
                test: /\.(woff|woff2|ttf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[ext]'
                }
            },
            {
                test: /\.(jpe?g|png|webp|gif|svg)$/i,
                use: [
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            mozjpeg: {
                            progressive: true,
                            },
                            optipng: {
                            enabled: false,
                            },
                            pngquant: {
                            quality: [0.65, 0.90],
                            speed: 4
                            },
                            gifsicle: {
                            interlaced: false,
                            },
                            webp: {
                            quality: 75
                            }
                        }
                    }
                ],
                type: 'asset/resource'
            }
        ]
    },
    devServer: {
        port: 5000,
        open: true,
        hot: true
    }
}