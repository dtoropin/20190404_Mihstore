'use strict';
// gulp 4

var gulp = require('gulp'),
	watch = require('gulp-watch'),
	prefixer = require('gulp-autoprefixer'),
	minify = require('gulp-minify'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	rigger = require('gulp-rigger'),
	cssmin = require('gulp-csso'),
	gcmq = require('gulp-group-css-media-queries'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	// spritesmith = require("gulp.spritesmith"),
	// del = require('del'),
	rimraf = require('rimraf'),
	rename = require('gulp-rename'),
	notify = require('gulp-notify'),
	browserSync = require("browser-sync"),
	reload = browserSync.reload;

var path = {
	build: {
		html: 'build/',
		js: 'build/js/',
		css: 'build/css/',
		img: 'build/img/',
		fonts: 'build/fonts/',
		data: 'build/data/',
		sprite: 'build/img/sprite/'
	},
	src: {
		html: 'app/*.html',
		js: 'app/js/[^vendor]*.js',
		jsvendor: 'app/js/vendor.js',
		style: 'app/sass/*.sass',
		img: 'app/img/**/*.*',
		fonts: 'app/fonts/**/*.*',
		data: 'app/data/*.json',
		sprite: 'app/img/sprite/*.*'
	},
	watch: {
		html: 'app/**/*.html',
		js: 'app/js/**/*.js',
		style: 'app/sass/**/*.sass',
		img: 'app/img/**/*.*',
		fonts: 'app/fonts/**/*.*',
		data: 'app/data/*.json'
	},
	clean: './build'
};

var config = {
	server: {
		baseDir: "./build"
	},
	host: 'localhost',
	port: 9000,
	browser: ['chrome']
};

// data
gulp.task('data:build', function () {
	return gulp.src('app/data/*.json')
		.pipe(gulp.dest('build/data/'))
		.pipe(reload({ stream: true }));
});

// html
gulp.task('html:build', function () {
	return gulp.src(path.src.html)
		.pipe(rigger())
		.pipe(gulp.dest(path.build.html))
		.pipe(reload({ stream: true }));
});

// js
gulp.task('js:build', function () {
	return gulp.src(path.src.js)
		.pipe(rigger())
		// .pipe(sourcemaps.init())
		.pipe(minify({
			noSource: true,
			ext: {
				min: '.min.js'
			}
		}))
		// .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({ stream: true }));
});

// js-vendor
gulp.task('jsvendor:build', function () {
	return gulp.src(path.src.jsvendor)
		.pipe(rigger())
		.pipe(minify({
			noSource: true,
			ext: {
				min: '.min.js'
			}
		}))
		.pipe(gulp.dest(path.build.js))
		.pipe(reload({ stream: true }));
});

// styles
gulp.task('style:build', function () {
	return gulp.src(path.src.style)
		// .pipe(sourcemaps.init())
		.pipe(sass({ outputStyle: 'expand' }).on("error", notify.onError()))
		.pipe(rename({ suffix: '.min', prefix: '' }))
		.pipe(prefixer())
		.pipe(gcmq())
		.pipe(cssmin())
		// .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(path.build.css))
		.pipe(reload({ stream: true }));
});

// images
gulp.task('image:build', function () {
	return gulp.src(path.src.img)
		.pipe(imagemin({
			progressive: true,
			svgoPlugins: [{ removeViewBox: false }],
			use: [pngquant()],
			interlaced: true
		}))
		.pipe(gulp.dest(path.build.img))
		.pipe(reload({ stream: true }));
});

// ????????????????????????????
// Сборка спрайтов PNG
// gulp.task('cleansprite', function() {
//     return del.sync('dev/static/img/sprite/sprite.png');
// });
// gulp.task('spritemade', function() {
//     var spriteData =
//         gulp.src(path.src.sprite)
//         .pipe(spritesmith({
//             imgName: 'sprite.png',
//             cssName: '_sprite.sass',
//             padding: 10,
//             cssFormat: 'sass',
//             algorithm: 'binary-tree',
//             cssTemplate: 'sass.template.mustache', //?
//             cssVarMap: function(sprite) {
//                 sprite.name = 's-' + sprite.name;
//             }
//         }));
//     return (
//     	spriteData.img.pipe(gulp.dest(path.build.sprite));
//     	spriteData.css.pipe(gulp.dest('app/sass/core/'));
//     )
// });
// gulp.task('sprite', gulp.series('cleansprite', 'spritemade'));
// gulp.task('sprite', gulp.series('spritemade'));

// fonts
gulp.task('fonts:build', function () {
	return gulp.src(path.src.fonts)
		.pipe(gulp.dest(path.build.fonts))
});

// build
gulp.task('build', gulp.parallel('data:build', 'html:build', 'jsvendor:build', 'js:build', 'style:build', 'image:build', 'fonts:build'));

// watch
gulp.task('watch', function () {
	watch([path.watch.html], gulp.series('html:build'));
	watch([path.watch.style], gulp.series('style:build'));
	watch([path.watch.js], gulp.series('js:build'));
	watch([path.watch.img], gulp.series('image:build'));
	watch([path.watch.fonts], gulp.series('fonts:build'));
	watch([path.watch.data], gulp.series('data:build'));
});

// server
gulp.task('webserver', function () {
	browserSync(config);
});

// clean
gulp.task('clean', function (cb) {
	rimraf(path.clean, cb);
});

// default task
gulp.task('default', gulp.series('clean', 'build', gulp.parallel('webserver', 'watch')));