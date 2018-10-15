import gulp from 'gulp';
import rename from "gulp-rename";
import del from 'del';
import project from '../aurelia.json';

import webpackConfig from '../../webpack.omero';
import webpack from 'webpack';

const cssPath = project.paths.plugin + '/omero_iviewer/static/omero_iviewer/css';
const jsPath = project.paths.plugin + '/omero_iviewer/static/omero_iviewer';
const templatePath = project.paths.plugin + '/omero_iviewer/templates/omero_iviewer';

function copyCssFiles() {
  return gulp.src(config.output.path + '/**/*.css')
    .pipe(rename('all.min.css'))
    .pipe(gulp.dest(cssPath));
}

function copyJsFiles() {
  return gulp.src(config.output.path + '/**/*.js')
    .pipe(gulp.dest(jsPath));
}

function copyIndexHtml() {
  return gulp.src('src/index.html')
    .pipe(gulp.dest(templatePath));
}

function clearPlugin() {
  return del([cssPath, jsPath, templatePath]);
}

const config = webpackConfig();
const compiler = webpack(config);

function buildWebpack(done) {
  if (CLIOptions.hasFlag('watch')) {
    compiler.watch({}, onBuild);
  } else {
    compiler.run(onBuild);
    compiler.plugin('done', () => done());
  }
}

function onBuild(err, stats) {
  if (!CLIOptions.hasFlag('watch') && err) {
    console.error(err.stack || err);
    if (err.details) console.error(err.details);
    process.exit(1);
  } else {
    process.stdout.write(stats.toString({ colors: require('supports-color') }) + '\n');

    if (!CLIOptions.hasFlag('watch') && stats.hasErrors()) {
      process.exit(1);
    }
  }
}

function clearDist() {
  return del([config.output.path]);
}

const buildPlugin = gulp.series(
  clearDist,
  configureEnvironment,
  buildWebpack
);

// const buildPlugin = gulp.series(
//   build,
//   clearPlugin,
//   copyCssFiles,
//   copyJsFiles,
//   copyIndexHtml
// );

export {
  buildPlugin as default
};
