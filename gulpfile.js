var gulp = require('gulp'),
    concat = require('gulp-concat'),
    //watch = require('gulp-watch'),
    usemin = require('gulp-usemin');

gulp.task('default', function() {
    gulp.src(['node_modules/d3/d3.js',
        'node_modules/vega/vega.js',
        'node_modules/vega-embed/vega-embed.js',
        'src/client.js',
        'src/index.html',
        ])
        //.pipe(concat('script.js'))
        .pipe(gulp.dest('public'));
   
});
