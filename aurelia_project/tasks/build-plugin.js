import gulp from 'gulp';
import rename from "gulp-rename";
import del from 'del';
import project from '../aurelia.json';
import build, {config} from './build';


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

const buildPlugin = gulp.series(
  build,
  clearPlugin,
  copyCssFiles,
  copyJsFiles,
  copyIndexHtml
);

export {
  buildPlugin as default
};
