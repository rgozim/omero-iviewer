const path = require('path');
const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebPackPlugin = require("copy-webpack-plugin");

const pluginDir = "plugin/omero_iviewer/"

// the path(s) that should be cleaned
const pathsToClean = [
  pluginDir + "*.*"
];

const copyFilesAndFolders = [
  // Add node modules to distribute here
  { from: "src/index.html", to: "plugin/omero_iviewer/templates/omero_iviewer" },
  { from: "src/openwith.js", to: "plugin/omero_iviewer/static/omero_iviewer/" },
  { from: "build/css/*", to: "plugin/omero_iviewer/static/omero_iviewer/css" },
  { from: "build/*.js*", to: "plugin/omero_iviewer/static/omero_iviewer/" }
];

module.exports = {
  output: {
    path: root(pluginDir)
  },
  plugins: [
    new CleanWebpackPlugin(pathsToClean)
    //new CopyWebPackPlugin(copyFilesAndFolders)
  ]
}

function root( args ) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [ __dirname ].concat(args));
}
