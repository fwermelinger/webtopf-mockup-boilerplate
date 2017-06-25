(function () {
    'use strict';

    var gulp = require('gulp');
    var sass = require('gulp-sass');
    var uglify = require('gulp-uglify');
    var sourcemaps = require('gulp-sourcemaps');
    var browserSync = require('browser-sync').create();
    var del = require('del');
    var concat = require('gulp-concat');
    var autoprefixer = require('gulp-autoprefixer');

    var path = {
        source: 'src/',
        dest: 'dist/'
    };

    gulp.task('images', function () {
        //this image task does not minimize images. (minimizing takes too long to run every time for development)
        return gulp.src(path.source + 'images/**')
            .pipe(gulp.dest(path.dest + 'images/'));
    });

    gulp.task('fonts', function () {
        return gulp.src(path.source + 'fonts/**')
        //.pipe(flatten())
            .pipe(gulp.dest(path.dest + 'fonts/'));
    });


    gulp.task('scripts', function () {
        gulp.src(path.source + 'scripts/jquery/*.js')
            .pipe(sourcemaps.init())
            .pipe(concat('jquerybundle.min.js'))
            .pipe(sourcemaps.write())
            .pipe(uglify())
            .pipe(gulp.dest(path.dest + 'scripts'));

        gulp.src(path.source + 'scripts/vendors/*.js')
            .pipe(sourcemaps.init())
            .pipe(concat('vendorbundle.min.js'))
            .pipe(sourcemaps.write())
            .pipe(uglify())
            .pipe(gulp.dest(path.dest + 'scripts'));

    });

    gulp.task('styles', function () {
        gulp.src(path.source + 'styles/*.scss')
            .pipe(sourcemaps.init())
            .pipe(sass({outputStyle: 'compressed'})
                .on('error', sass.logError))
            .pipe(autoprefixer({
                cascade: false
            }))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest(path.dest + 'styles/'))
            .pipe(browserSync.stream({match: '**/*.css'}));
    });

    gulp.task('html', function () {
        gulp.src('**.html')
            .pipe(browserSync.stream());
    });

    gulp.task('watch', function () {
        browserSync.init({
            server: '.'
        });

        gulp.watch('**.html', ['html']);
        gulp.watch(path.source + 'styles/**', ['styles']);
        gulp.watch(path.source + 'images/*', ['images']);
        gulp.watch(path.source + 'scripts/**', ['scripts']);
    });

    gulp.task('clean', del.bind(null, [path.dest]));

    gulp.task('build', function () {
        gulp.start(['html', 'styles', 'fonts', 'scripts', 'images']);
    });

    gulp.task('default', ['clean'], function () {
        gulp.start('build');
    });
}());