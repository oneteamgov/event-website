// Dependencies
const gulp = require('gulp')
const pkg = require('./package.json')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const header = require('gulp-header')
const pixrem = require('gulp-pixrem')
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const minifyCss = require('gulp-clean-css')
const frontMatter = require('gulp-front-matter')
const data = require('gulp-data')
const sourcemaps = require('gulp-sourcemaps')
const del = require('del')
const browserSync = require('browser-sync')
const reload = browserSync.reload
const browserify = require('browserify')
const imagemin = require('gulp-imagemin')
const notify = require('gulp-notify')
const plumber = require('gulp-plumber')
const gulpIf = require('gulp-if')
const babelify = require('babelify')
const gulpUtil = require('gulp-util')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const runSequence = require('run-sequence')
const nunjucksRender = require('gulp-nunjucks-render')
const nunjucksFilters = require('./filters')

// Banner
const banner = [
  '/**',
  ' * @name <%= pkg.name %>: <%= pkg.description %>',
  ' * @version <%= pkg.version %>: <%= new Date().toUTCString() %>',
  ' * @author <%= pkg.author %>',
  ' * @license <%= pkg.license %>',
  ' */'
].join('\n')

// Error notification
function onError(err) {
  notify.onError({
    title: 'Gulp',
    subtitle: 'Failure!',
    message: 'Error: <%= error.message %>',
    sound: 'Beep'
  })(err)

  this.emit('end')
}

// ------------------------
// Configuration
// ------------------------
// Autoprefixer settings
const AUTOPREFIXER_BROWSERS = [
  'ie >= 8',
  'ie_mob >= 10',
  'ff >= 20',
  'chrome >= 4',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
]

// Build root destination / webroot for serve
const outputDir = './build'

// Asset destination base path
const assetPath = '/assets'

// Paths for source and destinations
const paths = {
  src: {
    css: './src/scss/',
    js: './src/js/',
    html: './src/templates/',
    img: './src/img/',
    fonts: './src/fonts/'
  },
  dest: {
    css: `${outputDir}${assetPath}/css/`,
    js: `${outputDir}${assetPath}/js/`,
    html: outputDir,
    img: `${outputDir}${assetPath}/img/`,
    fonts: `${outputDir}${assetPath}/fonts/`
  }
}

// ------------------------
// Tasks
// ------------------------
function clean() {
  return del(`${paths.dest}`)
}

function jsCore() {
  return browserify({
    entries: `${paths.src.js}app.js`,
    debug: !gulpUtil.env.production
  })
    .transform(babelify, { presets: ['es2015'] })
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulpIf(!!gulpUtil.env.production, uglify()))
    .pipe(gulp.dest(paths.dest.js))
}

function html() {

  var manageEnvironment = function(env) {

    Object.keys(nunjucksFilters).forEach(function (filterName) {
      env.addFilter(filterName, nunjucksFilters[filterName])
    })

  }

  return gulp
    .src(`${paths.src.html}views/**/*.html`)
    .pipe(plumber({ errorHandler: onError }))
    .pipe(frontMatter({ property: 'data' }))
    .pipe(
      data(() => {
        return {
          assetPath: assetPath
        }
      })
    )
    .pipe(nunjucksRender({
      path: paths.src.html,
      manageEnv: manageEnvironment
    }))
    .pipe(gulp.dest(paths.dest.html))
}

function scss() {
  return gulp
    .src([
      `${paths.src.css}**/*.scss`,
      `!${paths.src.css}{fonts,kss}/*.*`])
    .pipe(plumber({ errorHandler: onError }))
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(pixrem())
    .pipe(header(banner, { pkg: pkg }))
    .pipe(sourcemaps.write())
    .pipe(gulpIf(!!gulpUtil.env.production, minifyCss()))
    .pipe(gulp.dest(paths.dest.css))
}

function img() {
  return gulp
    .src(`${paths.src.img}**/*`)
    .pipe(
      imagemin({
        progressive: true,
        interlaced: true,
        svgoPlugins: [{ removeViewBox: true }]
      })
    )
    .pipe(gulp.dest(paths.dest.img))
}

function fonts() {
  return gulp.src(`${paths.src.fonts}**/*.*`).pipe(gulp.dest(paths.dest.fonts))
}

function serve() {
  browserSync({
    notify: false,
    // https: true,
    server: [outputDir],
    tunnel: false,
    open: false
  })
  watch(reload)
}

function watch(cb) {
  const watchers = [
    { glob: `${paths.src.html}**/*.html`, tasks: ['html'] },
    { glob: `${paths.src.css}**/*.scss`, tasks: ['scss'] },
    { glob: `${paths.src.img}**/*`, tasks: ['img'] },
    { glob: `${paths.src.js}**/*`, tasks: ['js'] }
  ]
  watchers.forEach(watcher => {
    cb && watcher.tasks.push(cb)
    gulp.watch(watcher.glob, watcher.tasks)
  })
}

// ------------------------
// Gulp API
// ------------------------
gulp.task('compile', () => {
  runSequence('clean', ['js', 'scss', 'img', 'html', 'fonts'])
})

gulp.task('jsCore', jsCore)

gulp.task('clean', clean)
gulp.task('js', ['jsCore'])
gulp.task('html', html)
gulp.task('scss', scss)
gulp.task('img', img)
gulp.task('fonts', fonts)
gulp.task('serve', () => {
  runSequence('clean', ['js', 'scss', 'img', 'html', 'fonts'], serve)
})
gulp.task('watch', watch)
gulp.task('default', ['serve'])
