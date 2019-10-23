"use strict";

var gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  maps = require('gulp-sourcemaps'),
  del = require('del'),
  browserSync = require('browser-sync').create(),
  htmlreplace = require('gulp-html-replace'),
  cssmin = require('gulp-cssmin');

gulp.task("concatScripts", function() {
  return gulp.src([
    'assets/js/vendor/jquery-3.2.1.js',
    'assets/js/vendor/jquery.waypoints.js',
    'assets/js/functions.js'
  ])
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
    .pipe(gulp.dest('dist/assets/js'));
});

gulp.task("minifyCss", ["compileSass"], function() {
  return gulp.src("assets/css/main.css")
    .pipe(cssmin())
    .pipe(rename('main.css'))
    .pipe(gulp.dest('dist/assets/css'));
});

gulp.task('watchFiles', function() {
  gulp.watch('assets/js/*.js', ['concatScripts']);
});

gulp.task('clean', function() {
  del(['dist', 'assets/css/main.css*', 'assets/js/main*.js*']);
});

gulp.task('renameSources', function() {
  return gulp.src(['*.html', '**/*.php', '!dist', '!dist/**'])
    .pipe(htmlreplace({
      'js': 'assets/js/main.js',
      'css': 'assets/css/main.css'
    }))
    .pipe(gulp.dest('dist/'));
});

gulp.task("build", ['minifyScripts', 'minifyCss'], function() {
  return gulp.src([
    '*.html',
    '*.php',
    'favicon.ico',
    "assets/img/**"
  ], { base: './'})
    .pipe(gulp.dest('dist'));
});

gulp.task('serve', ['watchFiles'], function(){
  browserSync.init({
    server: "./"
  });
  
  gulp.watch("assets/css/**/*.scss", ['watchFiles']);
  gulp.watch(['*.html', '*.php']).on('change', browserSync.reload);
});

gulp.task("default", ["clean", 'build'], function() {
  gulp.start('renameSources');
});
