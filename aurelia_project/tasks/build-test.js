import path from 'path';
import gulp from 'gulp';
import del from 'del';
import rename from 'gulp-rename';
import webpack from 'webpack';
import {CLIOptions, Configuration} from 'aurelia-cli';

import project from '../aurelia.json';
import webpackConfig from '../../webpack.omero.test';
import configureEnvironment from './environment';

const analyze = CLIOptions.hasFlag('analyze');
const buildOptions = new Configuration(project.build.options);
const production = CLIOptions.getEnvironment() === 'prod';
const server = buildOptions.isApplicable('server');
const extractCss = buildOptions.isApplicable('extractCss');
const coverage = buildOptions.isApplicable('coverage');

const config = webpackConfig({
    production, server, extractCss, coverage, analyze
});
const compiler = webpack(config);

/**
 * 
 */
function clearDist() {
    return del([config.output.path]);
}

/**
 * Same function as in build.ts
 * @param {} done 
 */
function buildWebpack(done) {
    if (CLIOptions.hasFlag('watch')) {
        compiler.watch({}, onBuild);
    } else {
        compiler.run(onBuild);
        compiler.plugin('done', () => done());
    }
}

/**
 * 
 * @param {*} err 
 * @param {*} stats 
 */
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

const templatePath = path.join(
    project.iviewer.root,
    project.iviewer.templates
);
const staticPath = path.join(
    project.iviewer.root,
    project.iviewer.static
);

function copyStaticFiles() {
    return gulp.src([config.output.path + '/**/*', '!/**/*.js', '!/**/*.html'])
        .pipe(gulp.dest(staticPath));
}

function copyAppFile() {
    return gulp.src([config.output.path + '/app.*.bundle.js'])
        .pipe(rename('app.js'))
        .pipe(gulp.dest(staticPath));
}

function copyVendorFile() {
    return gulp.src([config.output.path + '/vendor.*.bundle.js'])
        .pipe(rename('vendor.js'))
        .pipe(gulp.dest(staticPath));
}

function copyIndexHtml() {
    return gulp.src('src/index.html')
        .pipe(gulp.dest(templatePath));
}

function clearPlugin() {
    return del([staticPath, templatePath]);
}

const createPluginDir = gulp.series(
    clearPlugin,
    copyStaticFiles,
    copyAppFile,
    copyVendorFile,
    copyIndexHtml
);

const buildPlugin = gulp.series(
    clearDist,
    configureEnvironment,
    buildWebpack,
    createPluginDir
);

export {
    buildPlugin as default
};