"use strict";

var dist = '../ehrle-build';
var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  maps = require('gulp-sourcemaps'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  del = require('del'),
  browserSync = require('browser-sync').create(),
  htmlreplace = require('gulp-html-replace'),
  fileInclude = require('gulp-file-include'),
  cssmin = require('gulp-cssmin');

const scripts = [
  'assets/js/functions.js',
  'assets/js/app.js',
];
const devScripts = [
  'assets/js/vendor/vue-view.js',
  'assets/js/vendor/vue-image-lightbox.min.js',
  'assets/js/vendor/vue-lazyload.js',
  'assets/js/vendor/vue.js',
  ...scripts
];
const prodScripts = [
  'assets/js/vendor/vue-view.js',
  'assets/js/vendor/vue-image-lightbox.min.js',
  'assets/js/vendor/vue-lazyload.js',
  'assets/js/vendor/vue.min.js',
  ...scripts
];

gulp.task('fileInclude', function() {
  gulp.src(['./pages/*.html'])
      .pipe(fileInclude({
        filters: {
          prefix: '@@',
          basepath: '@file',
        },
        context: {
          title: 'EHRLE'
        }
      }))
      .pipe(gulp.dest('./'));
});

gulp.task("concatScripts", function() {
  return gulp.src(devScripts)
    .pipe(maps.init())
    .pipe(concat('main.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('assets/js'))
    .pipe(browserSync.stream());
});
gulp.task("concatProdScripts", function() {
  return gulp.src(prodScripts)
    .pipe(maps.init())
    .pipe(concat('main.js'))
    .pipe(maps.write('./'))
    .pipe(gulp.dest('assets/js'))
    .pipe(browserSync.stream());
});

gulp.task("minifyScripts", ["concatScripts"], function() {
  return gulp.src("assets/js/main.js")
    .pipe(uglify())
    .pipe(rename('main.js'))
    .pipe(gulp.dest(dist + '/assets/js'));
});
gulp.task("minifyProdScripts", ["concatProdScripts"], function() {
  return gulp.src("assets/js/main.js")
    // .pipe(uglify())
    .pipe(rename('main.js'))
    .pipe(gulp.dest(dist + '/assets/js'));
});

gulp.task('compileSass', function() {
  return gulp.src("assets/css/main.scss")
    .pipe(maps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(maps.write('./'))
    .pipe(gulp.dest('assets/css'))
    .pipe(browserSync.stream());
});

gulp.task("minifyCss", ["compileSass"], function() {
  return gulp.src("assets/css/main.css")
    .pipe(cssmin())
    .pipe(rename('main.css'))
    .pipe(gulp.dest(dist + '/assets/css'));
});

gulp.task('watchFiles', function() {
  gulp.watch('assets/css/**/*.scss', ['compileSass']);
  gulp.watch('assets/js/*.js', ['concatScripts']);
});

gulp.task('clean', function() {
  del([dist, 'assets/css/main.css*', 'assets/js/main*.js*']);
});

gulp.task('renameSources', function() {
  return gulp.src(['*.html', '**/*.php', '!dist', '!dist/**'])
    .pipe(htmlreplace({
      'js': 'assets/js/main.js',
      'css': 'assets/css/main.css'
    }))
    .pipe(gulp.dest(dist + '/'));
});

gulp.task("build", ['minifyProdScripts', 'minifyCss', 'fileInclude'], function() {
  return gulp.src([
    '*.html',
    '*.php',
    'favicon.ico',
    "assets/icons/**",
    "assets/images/**",
    "assets/fonts/**",
    "assets/css/**/*.css"
  ], { base: './'})
    .pipe(gulp.dest(dist));
});

gulp.task('serve', ['watchFiles', 'fileInclude'], function(){
  browserSync.init({
    server: "./"
  });
  gulp.watch("assets/css/**/*.scss", ['watchFiles']);
  gulp.watch(['*/*.html', '**/*.php'], ['fileInclude']).on('change', browserSync.reload);
  gulp.watch(['**/*.html', '**/*.php']).on('change', browserSync.reload);
});

gulp.task("default", ["clean", 'build'], function() {
  gulp.start('renameSources');
});
