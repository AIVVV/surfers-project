// Define all gulp variables witch is needed
var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var autoPrefixer = require('gulp-autoprefixer');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var browserify = require('gulp-browserify');
var merge = require('merge-stream');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');

// Object for src folder paths
var SOURCEPATHS = {
    sassSource: 'src/scss/*.scss',
    sassApp: 'src/scss/styles.scss',
    htmlSource: 'src/*.html',
    htmlPartialSourse: 'src/partial/*.html',
    jsSource: 'src/js/**',
    imgSource: 'src/img/**'
};

// Object for app folder paths
var APPPATH = {
    root: 'app/',
    css: 'app/css',
    js: 'app/js',
    fonts: 'app/fonts',
    img: 'app/img'
};

// This task clean html files - if html file is deleted from src folder it will deleted from app folder too.
gulp.task('clean-html', function() {
    return gulp.src(APPPATH.root + '/*.html', { read: false, force: true })
        .pipe(clean());
});

// This task clean html files - if html file is deleted from src folder it will deleted from app folder too.
gulp.task('clean-script', function() {
    return gulp.src(APPPATH.js + '/*.js', { read: false, force: true })
        .pipe(clean());
});

// Gulp sass - This task is for compile scss files to css files
gulp.task('sass', function() {
    return gulp.src(SOURCEPATHS.sassApp)
        .pipe(autoPrefixer())
        .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(APPPATH.css));
});

// Move bootstrap fonts from node_modules to app folder
gulp.task('moveFonts', function() {
    gulp.src('.node_modules/bootstrap/fonts/*.{eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest(APPPATH.fonts));
});

// This task create copies of html files - if html file is created from src folder it will created from app folder too.
gulp.task('copy-html', ['clean-html'], function() {
    return gulp.src(SOURCEPATHS.htmlSource)
        .pipe(gulp.dest(APPPATH.root));
});

// This task create copies of js files - if js file is created from src folder it will created from app folder too.
gulp.task('copy-script', ['clean-script'], function() {
    return gulp.src(SOURCEPATHS.jsSource)
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest(APPPATH.js));
});

// Task for minification of images useing in project
gulp.task('images', function() {
    gulp.src(SOURCEPATHS.imgSource)
        .pipe(newer(APPPATH.img))
        .pipe(imagemin())
        .pipe(gulp.dest(APPPATH.img));
});

// Browser sync task - this task is for automaticly update all changes in css, html and js files. Also create a localhost path and automaticly added in browser.
gulp.task('serve', ['sass'], function() {
    browserSync.init([APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js'], {
        server: {
            baseDir: APPPATH.root
        }
    });
});

// Gulp watch task - this task is for looking if there any changes in scss or js files of html files. If there are the watch task automaticly updated and refreshed in browser.
gulp.task('watch', ['serve', 'sass', 'copy-html', 'clean-html', 'copy-script', 'clean-script', 'moveFonts', 'images'], function() {
    gulp.watch([SOURCEPATHS.sassSource], ['sass']);
    gulp.watch([SOURCEPATHS.htmlSource], ['copy-html']);
    gulp.watch([SOURCEPATHS.jsSource], ['copy-script']);
    gulp.watch([SOURCEPATHS.imgSource], ['images']);
});

// Gulp default task
gulp.task('default', ['watch']);