var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var wrapper = require('gulp-wrapper');

gulp.task('build', function() {
  gulp.src([
    'src/helpers.js',
    'src/TemplateCache.js',
    'src/*.js',
    'src/directives/*.js'
  ])
  .pipe(concat('renderer-router.js'))
  .pipe(wrapper({
    header: '(function() { "use strict"; ',
    footer: '}());'
  }))
  .pipe(gulp.dest('build'));
});
