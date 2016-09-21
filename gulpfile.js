var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglifycss = require('gulp-uglifycss'),
    uglifyjs = require('gulp-uglify-cli'),
    htmlmin = require('gulp-html-minifier'),
    strip = require('gulp-strip-comments'),
    minifyInline = require('gulp-minify-inline'),
    rename = require('gulp-rename'),
    del = require('del');

gulp.task('htmlfile', function () {
    return gulp.src('./html/*.html')
        .pipe(strip({ trim: true }))
        .pipe(htmlmin({ collapseWhitespace: true }))
	.pipe(minifyInline())
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./public'));
});

gulp.task('jsfile', function () {
    return gulp.src('./js/*.js')
		.pipe(concat('main.js'))
		.pipe(uglifyjs())
		.pipe(gulp.dest('././public/js'));
});

gulp.task('cleaner', function () {
    return del(['public']);
});

gulp.task('default', ['cleaner'], function () {
    gulp.start('htmlfile','jsfile');
});