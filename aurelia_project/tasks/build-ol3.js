import path from 'path';
import gulp from 'gulp';
import del from 'del';
import gccmain from 'google-closure-compiler';

const closureCompiler = gccmain.gulp();
const outputPath = './libs/ol3-viewer/dist';
const srcPath =  path.resolve(__dirname, 'libs/ol3-viewer/src/ome');
const closureUtils = './node_modules/closure-util';


const srcArray = [
  'libs/ol3-viewer/src/ome/**.js',
  'node_modules/openlayers/src/**.js',
  'node_modules/openlayers/build/ol.ext/**.js'
];

function clearDist() {
  return del([outputPath]);
}

// function jsCompile() {
//   closureBuilder.build({
//     name: 'name',
//     srcs: glob([
//       'libs/ol3-viewer/src/ome/**.js',
//       'node_modules/openlayers/src/**/*.js',
//     ]),
//     out: outputPath + '/merged-and-minified.js'
//   });
// }

function jsCompile() {
  return closureCompiler({
    js: srcArray,
    compilation_level: 'ADVANCED',
    warning_level: 'VERBOSE',
    js_output_file: 'output.min.js'
  })
    .src() // needed to force the plugin to run without gulp.src
    .pipe(gulp.dest(outputPath));
}

// function jsCompile() {
//   return gulp.src(path.join(srcPath, '**/*.js'), oljs, olsrc, closureUtils, { base: './' })
//     .pipe(closureCompiler({
//       compilation_level: 'SIMPLE',
//       warning_level: 'VERBOSE',
//       output_wrapper: outputWrapper,
//       js_output_file: 'ol3-viewer.js'
//     },
//       {
//         platform: ['native', 'java', 'javascript']
//       }))
//     .pipe(gulp.dest(outputPath));
// }

const build = gulp.series(
  clearDist,
  jsCompile
);

export {
  build as default
};
