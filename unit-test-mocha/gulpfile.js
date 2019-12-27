const gulp = require('gulp');
const mocha = require('gulp-mocha');
 
exports.default = () => (
    gulp.src(['components/**/*.spec.js'], {read: false})
        // `gulp-mocha` needs filepaths so you can't have any plugins before it
        .pipe(mocha({reporter: 'nyan'}))
);