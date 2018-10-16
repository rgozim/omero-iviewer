import path from 'path';
import gulp from 'gulp';
import del from 'del';
// import rename from 'gulp-rename';
import webpack from 'webpack';
import project from '../aurelia.json';
import configureEnvironment from './environment';
import webpackConfig from '../../webpack.omero';
import {CLIOptions} from 'aurelia-cli';

const cssPath = path.join(project.iviewer.root, project.iviewer.css);
const jsPath = path.join(project.iviewer.root, project.iviewer.js);
const templatePath = path.join(project.iviewer.root, project.iviewer.templates);

const config = webpackConfig;
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
    process.stdout.write(stats.toString({colors: require('supports-color')}) + '\n');

    if (!CLIOptions.hasFlag('watch') && stats.hasErrors()) {
      process.exit(1);
    }
  }
}

function clearDist() {
  return del([config.output.path]);
}

function copyCssFiles() {
  return gulp.src([config.output.path + '/**', '!*.js', '!*.html'])
    .pipe(gulp.dest(jsPath));
}

function copyJsFiles() {
  return gulp.src([config.output.path + '/*', '!css', 'src/openwith.js'])
    .pipe(gulp.dest(jsPath));
}

function copyIndexHtml() {
  return gulp.src('src/index.html')
    .pipe(gulp.dest(templatePath));
}

function clearPlugin() {
  return del([cssPath, jsPath, templatePath]);
}

const exec = require('child_process').exec;
gulp.task('runAntBuild', function(cb) {
  exec('ant', function(err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

const buildPlugin = gulp.series(
  // 'runAntBuild',
  clearDist,
  configureEnvironment,
  buildWebpack,
  clearPlugin,
  copyCssFiles,
  copyJsFiles,
  copyIndexHtml,
);

export {
  buildPlugin as default
};
