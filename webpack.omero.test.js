const webpackConfig = require('./webpack.config');
const merge = require('webpack-merge')
const { ProvidePlugin } = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = ({ production, server, extractCss, coverage, analyze, karma } = {}) => {
    // We want css to be extracted to seperate file
    extractCss = true;

    // This is the default aurelia clid config
    let aureliaConfig = webpackConfig({
        production, server, extractCss, coverage, analyze, karma
    });

    // This is our customisaton of the webpack plugin for Django
    const omeroConfig = {
        resolve: {
            modules: ['libs', ...aureliaConfig.resolve.modules],
        },
        module: {
            rules: [
                // embed fonts as Data Urls and larger ones as files:
                {
                    test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
                    loader: 'url-loader',
                    options: { limit: 10000, mimetype: 'application/font-woff2', name: 'css/fonts/[name].[ext]' }
                },
                {
                    test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
                    loader: 'url-loader',
                    options: { limit: 10000, mimetype: 'application/font-woff', name: 'css/fonts/[name].[ext]' }
                },
                // embed images as files:
                {
                    test: /\.(png|gif|jpg|cur)$/i,
                    loader: 'file-loader',
                    options: { name: 'css/images/[name].[ext]' }
                },
                // load these fonts normally, as files:
                {
                    test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
                    loader: 'file-loader?',
                    options: { name: 'css/fonts/[name].[ext]' }
                },
                {
                    test: /\.(scss|sass|css|less)$/,
                    use: ExtractTextPlugin.extract({
                        fallback: "style-loader",
                        use: [
                            {
                                loader: 'string-replace-loader',
                                options: {
                                    search: '"/client/',
                                    replace: '"',
                                    flags: 'g'
                                }
                            },
                            { loader: 'css-loader' },
                            { loader: 'less-loader' }

                        ]
                    })
                }
            ]
        },
        plugins: [
            new ProvidePlugin({
                'Promise': 'bluebird',
                $: 'jquery',
                jQuery: 'jquery'
            })
        ]
    };

    let output = merge.smart(aureliaConfig, omeroConfig);

    // config.plugins.splice(config.plugins.findIndex(p => p.constructor.name === ProvidePlugin.name), 1, providePlugin);
    return output;
};