const path = require('path');
const ClosurePlugin = require('closure-webpack-plugin');

module.exports = {
    entry: []


    plugins: {
        new ClosurePlugin({mode: 'STANDARD'}, {
            // compiler flags here
            //
            // for debuging help, try these:
            //
            // formatting: 'PRETTY_PRINT'
            // debug: true
          })
    }


}