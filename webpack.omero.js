const path = require('path');
const project = require('./aurelia_project/aurelia.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');
const { AureliaPlugin, ModuleDependenciesPlugin } = require('aurelia-webpack-plugin');
const { ProvidePlugin } = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const baseUrl = '/';
const srcDir = path.resolve(__dirname, 'src');
const outDir = path.resolve(__dirname, project.paths.plugin);
const nodeModulesDir = path.resolve(__dirname, 'node_modules');


// the path(s) that should be cleaned
const pathsToClean = [
  "plugin/omero_iviewer/static/*.*",
  "plugin/omero_iviewer/templates/*.*"
];

const copyFilesAndFolders = [
  // Add node modules to distribute here
  { from: "src/index.html", to: __dirname + "plugin/omero_iviewer/templates/omero_iviewer" },
  { from: "src/openwith.js", to: __dirname + "plugin/omero_iviewer/static/omero_iviewer/" },
  { from: "build/css/*", to: __dirname + "plugin/omero_iviewer/static/omero_iviewer/css" },
  { from: "build/*.js*", to: __dirname + "plugin/omero_iviewer/static/omero_iviewer/" }
];

module.exports = {
  resolve: {
    extensions: ['.js'],
    modules: [srcDir, 'node_modules'],
    // Enforce single aurelia-binding, to avoid v1/v2 duplication due to
    // out-of-date dependencies on 3rd party aurelia plugins
    alias: { 'aurelia-binding': path.resolve(__dirname, 'node_modules/aurelia-binding') }
  },
  entry: {
    app: ['aurelia-bootstrapper'],
    vendor: ['bluebird'],
  },
  mode: 'development',
  output: {
    path: outDir,
    publicPath: baseUrl
  },
  performance: { hints: false },
  module: {
    rules: [
      // CSS required in JS/TS files should use the style-loader that auto-injects it into the website
      // only when the issuer is a .js/.ts file, so the loaders are not applied inside html templates
      {
        test: /\.css$/i,
        issuer: [{ not: [{ test: /\.html$/i }] }],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'style-loader']
      },
      {
        test: /\.css$/i,
        issuer: [{ test: /\.html$/i }],
        // CSS required in templates cannot be extracted safely
        // because Aurelia would try to require it again in runtime
        use: [
          { loader: 'css-loader' }
        ]
      },
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      {
        test: /\.js$/i,
        loader: 'babel-loader',
        exclude: /(node_modules|bower_components)/
      },
      // use Bluebird as the global Promise implementation:
      { test: /[\/\\]node_modules[\/\\]bluebird[\/\\].+\.js$/, loader: 'expose-loader?Promise' },
      // embed small images and fonts as Data Urls and larger ones as files:
      { test: /\.(png|gif|jpg|cur)$/i, loader: 'url-loader', options: { limit: 8192 } },
      { test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff2' } },
      { test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'url-loader', options: { limit: 10000, mimetype: 'application/font-woff' } },
      // load these fonts normally, as files:
      { test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i, loader: 'file-loader' },
    ]
  },
  plugins: [
    new DuplicatePackageCheckerPlugin(),
    new AureliaPlugin(),
    new ProvidePlugin({
      'Promise': 'bluebird',
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new ModuleDependenciesPlugin({
      'aurelia-testing': ['./compile-spy', './view-spy']
    }),
    new HtmlWebpackPlugin({
      template: 'index.ejs',
      metadata: {
        // available in index.ejs //
        title, server, baseUrl
      }
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: "[id].css",
      allChunks: true
    })
  ]
};
