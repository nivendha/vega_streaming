var gulp = require('gulp'),
    concat = require('gulp-concat'),
    //watch = require('gulp-watch'),
    usemin = require('gulp-usemin');

gulp.task('default', function() {
    gulp.src(['node_modules/d3/build/d3.js',
        'node_modules/vega/vega.js',
        'node_modules/vega-embed/vega-embed.js'])
        //.pipe(concat('script.js'))
        .pipe(gulp.dest('public'));
   
});
