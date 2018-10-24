import path from 'path';
import gulp from 'gulp';
import del from 'del';
import gccmain from 'google-closure-compiler';

const srcPath =  './libs/ol3-viewer/src/';
const outputPath = './libs/ol3-viewer/dist/';
const closureCompiler = gccmain.gulp();

const outputWrapper = `(function (root, factory) {
            var tmp = null;
            if(typeof module === 'object' &amp;&amp; module.exports) {
                root = window;
                tmp =  factory.call(root);
                module.exports = tmp;
            } else {
                tmp = factory.call(root);
                if (typeof root.ome !== 'object') root.ome = {};
                root.ome = tmp;
            }
        }(this, function () {
            var OME = {};
            if (typeof(this) === 'object' &amp;&amp; typeof(this.ome) === 'object') {
                OME.ome = this.ome;
                var ome = this.ome;
            }
            %output%
            return OME.ome;
        }));`;

function clearDist() {
  return del([outputPath]);
}

function jsCompile() {
  return gulp.src(path.join(srcPath, '**/*.js'), {base: './'})
    .pipe(closureCompiler({
      compilation_level: 'SIMPLE',
      warning_level: 'VERBOSE',
      language_in: 'ECMASCRIPT6_STRICT',
      language_out: 'ECMASCRIPT5_STRICT',
      output_wrapper: outputWrapper,
      js_output_file: 'ol3-viewer.js'
    },
    {
      platform: ['native', 'java', 'javascript']
    }))
    .pipe(gulp.dest(outputPath));
}

const build = gulp.series(
  clearDist,
  jsCompile
);

export {
  build as default
};
