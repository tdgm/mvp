// Initialize modules
// Importing specific gulp API functions lets us write them below as series() instead of gulp.series()
const { src, dest, watch, series, parallel } = require('gulp');
// Importing all the Gulp-related packages we want to use
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
var replace = require('gulp-replace');

// File paths
const files = { 
    scssPath: 'app/styles/**/*.scss',
    jsPath: 'app/scripts/**/*.js',
    vendorsPath: 'app/vendors/**/*',
    htmlPath: './*.html',
    imgPath: 'app/images/**/*'
}

// Sass task: compiles the style.scss file into style.css
function scssTask(){    
    return src(files.scssPath)
        .pipe(sourcemaps.init()) // initialize sourcemaps first
        .pipe(sass()) // compile SCSS to CSS
        .pipe(postcss([ autoprefixer(), cssnano() ])) // PostCSS plugins
        .pipe(sourcemaps.write('.')) // write sourcemaps file in current directory
        .pipe(dest('dist')
        
    ); // put final CSS in dist folder
}

// JS task: concatenates and uglifies JS files to script.js
function jsTask(){
    return src([
        files.jsPath
        //,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
        ])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(dest('dist')        
    );
}

// JS task: concatenates and uglifies JS files to script.js
function vendorsTask(){
    return src([
        files.vendorsPath
        //,'!' + 'includes/js/jquery.min.js', // to exclude any specific files
        ])
        .pipe(dest('dist')        
    );
}

// Imagemin task: minify images
function imgTask(){
    return src([
        files.imgPath
        ])
        .pipe(imagemin({
            interlaced: true,
            progressive: true,
            optimizationLevel: 5,
            svgoPlugins: [
                {
                    removeViewBox: true
                }
            ]})
        )
        .pipe(dest('dist')
    );
}

// Cachebust
var cbString = new Date().getTime();
function cacheBustTask(){
    return src(['index.html'])
        .pipe(replace(/cb=\d+/g, 'cb=' + cbString))
        .pipe(dest('.'));
}

// Watch task: watch SCSS and JS files for changes
// If any change, run scss and js tasks simultaneously
function watchTask(){
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    watch([files.scssPath, files.jsPath, files.vendorsPath, files.htmlPath, files.imgPath], 
        series(scssTask, jsTask, vendorsTask, imgTask)).on('change', browserSync.reload);
        
}

// Export the default Gulp task so it can be run
// Runs the scss and js tasks simultaneously
// then runs cacheBust, then watch task
exports.default = series(
    scssTask,
    jsTask,
    vendorsTask,
    imgTask, 
    cacheBustTask,
    watchTask
);