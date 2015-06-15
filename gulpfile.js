/**
 * Created by roach on 2015/6/9.
 */
var gulp = require('gulp');
var args = require('yargs').argv;

var config = require('./gulp.config')();
var del = require('del');

/*      get all plugins for me (no require(<plugin>) is required, but still need npm install it.
 *       npm install gulp-<pulgin> --save-dev
 */
var $ = require('gulp-load-plugins')({lazy: true});
var port = process.env.PORT || config.defaultPort;

//var jscs = require('gulp-jscs');
//var util = require('gulp-util');
gulp.task('help', $.taskListing);
gulp.task('default', ['help']);

gulp.task('fonts', ['clean-fonts'], function() {
    log('copying fonts');
    return gulp.src(config.fonts)
        .pipe(gulp.dest(config.build + 'fonts'));
});

gulp.task('clean', function(done) {
    var delconfig = [].concat(config.build, config.temp);
    log('Cleaning: ' + $.util.colors.blue(delconfig));
    del(delconfig, done);
});

gulp.task('clean-code', function(done) {
    // all of the code-like files inside of our build and temp folders.
    var files = [].concat(
        config.temp + '**/*.js',
        config.build + '**/*.html',
        config.build + 'js/**/*.js'
    )
    clean(files, done);
});

gulp.task('clean-fonts', function(done) {
    clean(config.build + 'fonts/**/*.*', done);
});

gulp.task("clean-images", function(done) {
    clean(config.build + 'images/**/*.*', done);
});

gulp.task('clean-css', function(done) {
    clean(config.temp + '**/*.css', done);
});

// we need to install this plugin first - nmp install --save-dev gulp-imagemin
gulp.task('images', ["clean-images"], function() {
    log('copying and compressing the images');
    return gulp
        .src(config.images)
        .pipe($.imagemin({optimizationLevel: 4}))
        .pipe(gulp.dest(config.build + 'images'));
});

gulp.task('vet', function() {
    log('Analyzing source with JSHint and JSCS');
    return gulp
        .src(config.alljs)
        .pipe($.jscs())
        .pipe($.jshint())
        .pipe($.uglify())
        .pipe(gulp.dest('./build/'));
});

// replace wiredep with inject after you have task styles ready
gulp.task('serve-dev', ['wiredep'], function() {
    var nodeOptions = {
        script: config.nodeServer,  // app.js in server folder
        delaytime: 1,
        env: {
            'PORT': port,
            "NODE_ENV": isDev ?  'dev' : 'build'
        },
        watch: [config.server]
    };
    return $nodemon(nodeOptions)
        // you can also inject task when restart like below
        //.on('restart', ['vet'], function(ev) {
        .on('restart', function(ev) {
            log('*** nodemon restarted');
            log('files changed on restarted:\n' + ev);
        })
        .on('start', function() {
            log ('*** nodemon started');
        })
        .on('crash', function() {
            log("*** nodemon crashed: script crashed for some reason");
        })
        .on('exit', function() {
            log('*** nodemon exited cleanly');
        });
});

/*
gulp.task('inject', ['wiredep', 'styles'] function() {
    log('Wiring up the app css into the html, and call wiredep');

    return gulp
        .src(config.index)// get index.html file
        .pipe(wiredep(options))// wiredep looks up bower.json
        // find all the files matching that pattern, config.js, and inject all those things into index.html
        .pipe($.inject(gulp.src(config.css)))
        .pipe(gulp.dest(config.client));
});
*/

/*  Automation add js and css
 *   it looks through the Bower files and finds all the dependencies and inject them into html
 */
gulp.task('wiredep', function() {
    log('Wiring up the bower dependencies (css and js), and our app js into the html');

    var wiredep = require('wiredep').stream;
    var options = config.getWiredepDefaultOptions();    // where is the bower file

    return gulp
        .src(config.index)// get index.html file
        .pipe(wiredep(options))// wiredep looks up bower.json
        // find all the files matching that pattern, config.js, and inject all those things into index.html
        .pipe($.inject(gulp.src(config.js)))
        .pipe(gulp.dest(config.client));
});


//////////////////////////

function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);    // done is a call back func in del package
}
/* i don't have style task yet
 gulp.task('inject', ['wiredep', 'styles'], function() {
 log('Wiring up the app css into the html, and call wiredep');
 return gulp
 .src(config.index)
 .pipe($.inject(gulp.src(config.css)))
 .pipe(gulp.dest(config.client));
 });
 */
function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}
