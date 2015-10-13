import header from 'gulp-header';
import prettify from 'gulp-prettify';
import gulp from 'gulp';
import rev from 'gulp-rev';
import revReplace from 'gulp-rev-replace';
import gulpif from 'gulp-if';
import sass from 'gulp-sass';
import livereload from 'gulp-livereload';
import del from 'del';

var pkg = require('./package.json');

var runSequence = require('run-sequence').use(gulp);

/** ALIASES **/
gulp.task('watch', ['default']);
gulp.task('sass', ['css']);

/** TASKS **/
gulp.task('default', ['assetsDev'], watch);
gulp.task('build:livereload', ['assetsDev'], reload);
gulp.task('assets', ['css'], assets);
gulp.task('assetsDev', ['css'], assetsDev);
gulp.task('css', css);
gulp.task('clean', clean);

gulp.task('build', (done) => {
  runSequence('clean', 'assets', done);
});

/** FILESYSTEM WATCHER **/
function watch(){
  livereload.listen();
  gulp.watch(['source/**/*', '!**/*.css'], ['build:livereload']);
}

/** DELETE PUBLIC **/
function clean(){
  del.sync(['public']);
}

function reload(){
  livereload.reload();
}

  /** DELETE PUBLIC **/
function css(){
  return gulp.src('source/scss/**.scss')
    .pipe(sass())

  // .pipe(sourcemaps.write('maps', {
  //     includeContent: false, //     sourceRoot: '/source'
  // }))

  .pipe(gulp.dest('source/css'));
}

/** BUILD PROCESS **/
function assets() {
  return gulp.src(['source/**/*', '!**/*.scss'])

    // Minify JS
    // .pipe(gulpif('*.js', uglify()))

    // Minify CSS
    // .pipe(gulpif('*.css', minifyCSS({ keepSpecialComments: 0 })))

    // Prettify HTML
    .pipe(gulpif('*.html', prettify({
      indent_size: 2,
    })))

    // Add versioned headers
    .pipe(gulpif('*.html', header('<!-- ' + pkg.name + ' v' + pkg.version + ' -->\n\n')))
    .pipe(gulpif(isJSorCSS, header('/* ' + pkg.name + ' v' + pkg.version + ' */\n\n')))

    // Optimize images
    // .pipe(imagemin({
    //   progressive: true, //   interlaced: true
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
    .pipe(gulp.dest('public'));
}
function isJSorCSS(vinyl){
  return /\.(js|css)$/.test(vinyl.relative);
}
