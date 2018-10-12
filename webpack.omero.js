const path = require('path');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebPackPlugin = require("copy-webpack-plugin");

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
  plugins: [
    new CleanWebpackPlugin(pathsToClean),
    new CopyWebPackPlugin(copyFilesAndFolders, { debug: 'info' })
  ]
}

function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
