//
// Copyright (C) 2017 University of Dundee & Open Microscopy Environment.
// All rights reserved.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//

import { PLATFORM } from 'aurelia-pal';
import { EventAggregator } from 'aurelia-event-aggregator';
import { bootstrap } from 'aurelia-bootstrapper';
import { Index } from './app/index';
import environment from './environment';
import Context from './app/context';
import Misc from './utils/misc';
import { URI_PREFIX, PLUGIN_NAME, WINDOWS_1252 } from './utils/constants';
import * as Bluebird from 'bluebird';

// import Index from './app/index';

// #if process.env.NODE_ENV
require('../node_modules/bootstrap/dist/css/bootstrap.min.css');
require('../node_modules/jquery-ui/themes/base/theme.css');
require('../node_modules/jquery-ui/themes/base/spinner.css');
require('../node_modules/jquery-ui/themes/base/slider.css');
require('../node_modules/spectrum-colorpicker/spectrum.css');
require('../css/ol3-viewer.css');
require('../css/app.css');
// #endif

// global scope settings
Bluebird.config({ warnings: { wForgottenReturn: false } });
window['encoding-indexes'] = { 'windows-1252': WINDOWS_1252 };

/* IMPORTANT:
 * we have to set the public path here to include any potential prefix
 * has to happen before the bootstrap!
 */
let req = window.INITIAL_REQUEST_PARAMS || {};
let is_dev_server = false;
// #if process.env.NODE_ENV === 'dev-server'
is_dev_server = true;
// #endif
if (!is_dev_server) {
  let prefix =
        typeof req[URI_PREFIX] === 'string' ?
          Misc.prepareURI(req[URI_PREFIX]) : '';
  __webpack_public_path__ = prefix + '/static/' + PLUGIN_NAME + '/';
}

export function configure(aurelia) {
  aurelia.use
    .basicConfiguration();

  // Uncomment the line below to enable animation.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-animator-css'));
  // if the css animator is enabled, add swap-order="after" to all router-view elements

  // Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  // aurelia.use.plugin(PLATFORM.moduleName('aurelia-html-import-template-loader'));

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  // if (environment.testing) {
  //   aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  // }

  let ctx = new Context(aurelia.container.get(EventAggregator), req);
  if (is_dev_server) {
    ctx.is_dev_server = true;
  }
  aurelia.container.registerInstance(Context, ctx);

  return aurelia.start().then(a => a.setRoot(PLATFORM.moduleName('app/index'), document.body));
}

/**
 * IViewer bootstrap function
 * @function
 * @param {Object} aurelia the aurelia instance
 */
// bootstrap(aurelia => {
//   aurelia.use
//     .basicConfiguration();
//     // .plugin(PLATFORM.moduleName('aurelia-dialog'));
//
//   let ctx = new Context(aurelia.container.get(EventAggregator), req);
//   if (is_dev_server) {
//     ctx.is_dev_server = true;
//   }
//
//   aurelia.container.registerInstance(Context, ctx);
//   aurelia.start().then(a => a.setRoot(PLATFORM.moduleName('app/index'), document.body));
// });
