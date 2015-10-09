var header = require('gulp-header')
  , prettify = require('gulp-prettify')
  , gulp = require('gulp')
  // , uglify = require('gulp-uglify')
  // , minifyCSS = require('gulp-minify-css')
  , rev = require('gulp-rev')
  , revReplace = require('gulp-rev-replace')
  , gulpif = require('gulp-if')
  // , imagemin = require('gulp-imagemin')
  , sass = require('gulp-sass')
  // , sourcemaps = require('gulp-sourcemaps')
  , s3 = require('gulp-s3')
  , livereload = require('gulp-livereload')
  , clc = require('cli-color')
  , s3 = require('s3')
  , bump = require('gulp-bump')
  , git = require('gulp-git')
  , argv = require('yargs').argv
  , version = require('gulp-tag-version')
  , request = require('superagent')
  , fs = require('fs')
  , path = require('path')
  , del = require('del');

var hogan = require('./bin/gulp-hogan')
  , Flex = require('./bin/gulp-resource');

var pkg = require('./package.json');

var runSequence = require('run-sequence').use(gulp);
/** ALIASES **/
gulp.task('watch',            ['default']);
gulp.task('sass',             ['css']);

/** TASKS **/
gulp.task('default',          ['assetsDev'],            watch);
gulp.task('build:livereload', ['assetsDev'],            reload);
gulp.task('assets',           ['css'],                  assets);
gulp.task('assetsDev',        ['css'],                  assetsDev);
gulp.task('css',                                        css);
gulp.task('clean',                                      clean);

gulp.task('build', function(done){
  runSequence('clean', 'assets', done);
});

/** FILESYSTEM WATCHER **/
function watch(){
  livereload.listen();
  gulp.watch(['source/**/*', '!**/*.css'],  ['build:livereload']);
}

/** DELETE PUBLIC **/
function clean(){
  del.sync([Flex.dest]);
}

function reload(){
  livereload.reload();
}

  /** DELETE PUBLIC **/
function css(){
  return gulp.src('source/scss/**.scss')
    .pipe(sass())

  // .pipe(sourcemaps.write('maps', {
  //     includeContent: false,
  //     sourceRoot: '/source'
  // }))

  .pipe(gulp.dest('source/css'));
}

/** BUILD PROCESS **/
function assets() {
  return gulp.src(['source/**/*', '!**/*.scss'])

    // Hogan parse templates
    .pipe(gulpif(isText, hogan()))

    // Minify JS
    // .pipe(gulpif('*.js', uglify()))

    // Minify CSS
    // .pipe(gulpif('*.css', minifyCSS({ keepSpecialComments: 0 })))

    // Prettify HTML
    .pipe(gulpif('*.html', prettify({
      'indent_size': 2
    })))

    // Add versioned headers
    .pipe(gulpif('*.html', header('<!-- ' + pkg.name + ' v' + pkg.version + ' -->\n\n')))
    .pipe(gulpif(isJSorCSS, header('/* ' + pkg.name + ' v' + pkg.version + ' */\n\n')))

    // Optimize images
    // .pipe(imagemin({
    //   progressive: true,
    //   interlaced: true
    // }))

    // Add revision sha-sum
    .pipe(gulpif(isJSorCSS, rev()))

    // // Replace sha'd references in all text files
    .pipe(revReplace())

    // Output stream to 'public'
    .pipe(gulp.dest('./public'));
}

function assetsDev(){
  return gulp.src(['source/**/*.*', '!**/*.scss'])
    .pipe(gulpif(isText, hogan()))
    .pipe(gulp.dest('./public'));
}
function isNotIndex(vinyl){
  return !/index\.html/.test(vinyl.relative);
}

function isJSorCSS(vinyl){
  return /\.(js|css)$/.test(vinyl.relative);
}

function isText(vinyl){
  return /\.(html|css|js)$/.test(vinyl.relative);
}
