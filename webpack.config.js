const merge = require("webpack-merge");
const omeroConfig = require("./webpack/webpack.omero");
const webpackConfig = require("./webpack/webpack.aurelia");

module.exports = ({ production, server, extractCss, coverage, analyze, karma } = {}) => {
  let config = webpackConfig({ production, server, extractCss, coverage, analyze, karma });
  return merge.multiple(config, omeroConfig);
}
