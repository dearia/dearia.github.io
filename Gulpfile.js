'use strict';

var gulp            = require("gulp"),
    watch           = require("gulp-watch"),
    concat          = require("gulp-concat"),
    plumber         = require("gulp-plumber"),
    sass            = require("gulp-sass"),
    uglify          = require("gulp-uglify"),
    prefix          = require("gulp-autoprefixer"),
    notify          = require("gulp-notify"),
    sourcemaps      = require("gulp-sourcemaps"),
    jshint          = require("gulp-jshint"),
    imagemin        = require('gulp-imagemin'),
    browserSync     = require('browser-sync').create(),
    pngquant        = require('imagemin-pngquant');
// --------------------------------------------    
var source  = './app';
var ghPages = '.';

// Source
var src = {
    cssPlugins  : [
        "./bower_components/foundation/scss/normalize.scss",
        "./bower_components/foundation/scss/foundation.scss"
    ],
    jsPlugins  : [
        "./bower_components/jquery/dist/jquery.js",
        "./bower_components/foundation/js/foundation.js",
        "./bower_components/modernizr/modernizr.js"
    ],
    sass    : source + '/assets/sass/**/*.sass',
    js      : source + '/assets/js/**/*.js',
    images  : source + '/assets/images/*'
};

// Destinations
var assets = {
    css     : ghPages + '/assets/css',
    js      : ghPages + '/assets/js',
    images  : ghPages + '/assets/images'
};

// File Name After Render
var filename = {
    css  : "main.css",
    js   : "main.js"
};

//----------------------------------------------
// SASS TASK
gulp.task('sass', function() {
    return gulp.src(src.sass)
        .pipe(plumber({errorHandler: notify.onError("Error :: <%= error.message %>")}))
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(prefix({ browsers: ['last 15 versions'], cascade: false }))
        .pipe(concat(filename.css))
        .pipe(gulp.dest(assets.css))
        .pipe(notify({ message: "CSS :: @ <%= file.relative %> Berhasil!!!" }))
        .pipe(browserSync.stream());
});

//----------------------------------------------
// JS TASK
gulp.task('js', function() {
    return gulp.src(src.js)
        .pipe(plumber({errorHandler: notify.onError("Error :: <%= error.message %>")}))
        .pipe(uglify())
        .pipe(concat(filename.js))
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(gulp.dest(assets.js))
        .pipe(notify({ message: "JS :: @ <%= file.relative %> Berhasil!!!" }))
        .pipe(browserSync.stream());
});

//----------------------------------------------
// Images Task
gulp.task('images', function () {
    return gulp.src(src.images)
        .pipe(imagemin({
            progressive: true,      // jpg (bool)
            optimizationLevel: 3,   // png (number) 0-7
            interlaced: false,      // gif (bool)
            multipass: false,       // svg (bool)
            svgoPlugins: [{removeViewBox: false}],          // svg (array) default: []
            use: [pngquant()]       // (array) default: []
        }))
        //.pipe(pngquant({quality: '65-80', speed: 4})())
        .pipe(gulp.dest(assets.images));
});


//----------------------------------------------
// PLUGIN STYLESHEET TASK
gulp.task('cssplugin', function() {
    return gulp.src(src.cssPlugins)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(prefix({ browsers: ['last 15 versions'], cascade: false }))
        .pipe(concat("plugin.css"))
        .pipe(gulp.dest(assets.css))
        .pipe(browserSync.stream());
});


////////////////////////////////////////////////////
// PLUGIN JS TASK
gulp.task('jsplugin', function() {
    return gulp.src(src.jsPlugins)
        .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
        .pipe(uglify())
        .pipe(concat("plugin.js"))
        .pipe(gulp.dest(assets.js))
        .pipe(browserSync.stream());
});

//----------------------------------------------
// Browser Sync
gulp.task('watch', function() {
    browserSync.init({
        server: "./_site"
    });
    gulp.watch(src.sass, ['sass']);
    gulp.watch(src.js, ['js']);
    gulp.watch(src.images, ['images']);
    gulp.watch("./_site/*.html").on('change', browserSync.reload);
});

//----------------------------------------------
// Build Assets
gulp.task('build:plugins', ['cssplugin', 'jsplugin']);      // Build Bower Plugins
gulp.task('build:assets', ['sass', 'js', 'images']);        // Build App Assets
gulp.task('build:all', ['build:plugins', 'build:assets']);  // Build Bower Plugins & App Assets

//----------------------------------------------
// Build and Watch
gulp.task('serve', ['build:all', 'watch']);                 // Build All, Watch, Running server

//----------------------------------------------
// Default TASK
gulp.task('default', ['watch']);                            // Just Watching App
