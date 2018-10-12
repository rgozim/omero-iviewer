const merge = require("webpack-merge");
const webpackOmero = require("./webpack.omero");
const webpackAurelia = require("./webpack.aurelia");

// module.exports = ({ production, server, extractCss, coverage, analyze, karma } = {}) => {
//   let ac = aureliaConfig({ production, server, extractCss, coverage, analyze, karma });
//   return merge(ac, omeroConfig);
// }

module.exports = ({ production, server, extractCss, coverage, analyze, karma } = {}) => {
  const aureliaConfig = merge([
    webpackAurelia({ 
      production, server, extractCss, coverage, analyze, karma 
    }),
  ]);

  const omeroConfig = merge([
    webpackOmero
  ]);

  return merge(aureliaConfig, omeroConfig);
}
