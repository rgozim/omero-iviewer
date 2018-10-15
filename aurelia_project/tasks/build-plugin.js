import gulp from 'gulp';
import {rename} from 'gulp-rename';
import project from '../aurelia.json';
import build, {config} from './build';


function copyCssFiles() {
  return gulp.src(config.output.path + '/**/*.css')
    .pipe(gulp.dest(project.paths.plugin + '/omero_iviewer/static/omero_iviewer/css'));
}

function copyJsFiles() {
  return gulp.src(project.paths.output + '/**/*.js')
    .pipe(gulp.dest(project.paths.plugin + '/omero_iviewer/static/omero_iviewer'));
}

function copyIndexHtml() {
  return gulp.src('src/index.html')
    .pipe(gulp.dest(project.paths.plugin + '/omero_iviewer/templates/omero_iviewer'));
}

const buildPlugin = gulp.series(
  build,
  copyCssFiles,
  copyJsFiles,
  copyIndexHtml
);

export {
  buildPlugin as default
};
