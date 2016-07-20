'use strict';

/*
|--------------------------------------------------------------------------
| Gulp Config Management
|--------------------------------------------------------------------------
|
*/

var gulp            = require("gulp"),
    concat          = require("gulp-concat"),
    plumber         = require("gulp-plumber"),
    sass            = require("gulp-sass"),
    uglify          = require("gulp-uglify"),
    prefix          = require("gulp-autoprefixer"),
    notify          = require("gulp-notify"),
    sourcemaps      = require("gulp-sourcemaps"),
    browserSync     = require('browser-sync').create();

/*
|--------------------------------------------------------------------------
| App Asset Variables
|--------------------------------------------------------------------------
|
*/

var resources = './_resources';
var app = {
    js: {
        src:  resources + '/assets/js/**/*.js',
        dest: './assets/js'
    },
    sass: {
        src:  resources + '/assets/sass/**/*.scss',
        dest: './assets/css'        
    },
    images: {
        src:  resources + '/assets/images/*',
        dest: './assets/images'
    }        
};

/*
|--------------------------------------------------------------------------
| Gulp Task Management
|--------------------------------------------------------------------------
|
*/

// SASS TASK
gulp.task('sass', function() {
    return gulp.src(app.sass.src)
        .pipe(plumber({errorHandler: notify.onError("Error :: <%= error.message %>")}))
        .pipe(sass({
            outputStyle: 'expanded',
            includePaths: [ "bower_components", "node_modules" ]
        }))
        .pipe(prefix({ browsers: ['last 15 versions'], cascade: false }))
        .pipe(concat("app.css"))
        .pipe(gulp.dest(app.sass.dest))
        .pipe(notify({ message: "CSS :: @ <%= file.relative %> Berhasil!!!" }));
});

// JS TASK
gulp.task('js', function() {
    return gulp.src(app.js.src)
        .pipe(plumber({errorHandler: notify.onError("Error :: <%= error.message %>")}))
        .pipe(uglify())
        .pipe(concat("app.js"))
        .pipe(gulp.dest(app.js.dest))
        .pipe(notify({ message: "JS :: @ <%= file.relative %> Berhasil!!!" }));
});

// Images Task
gulp.task('images', function () {
    return gulp.src(app.images.src)
        .pipe(gulp.dest(app.images.dest));
});


// Browser Sync
gulp.task('watch', function() {
    browserSync.init({
        // server: "./_site",
        proxy: "http://localhost:4000",
        files: [
            "./_site/**/*.css",
            "./_site/**/*.js",
            "./_site/**/*.html"
        ]
    });
    gulp.watch(app.sass.src, ['sass']);
    gulp.watch(app.js.src, ['js']);
    gulp.watch(app.images.src, ['images']);
});

// Build Assets
gulp.task('build', ['sass', 'js', 'images']);        // Build App Assets

// Build and Watch
gulp.task('serve', ['build', 'watch']);                 // Build All, Watch, Running server

// Default TASK
gulp.task('default', ['build']);                            // Just Watching App
