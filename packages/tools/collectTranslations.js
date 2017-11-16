const gulp = require('gulp');
const ts = require('gulp-typescript');
const babel = require('gulp-babel');
const debug = require('gulp-debug');
const escapeStringRegexp = require('escape-string-regexp');

const baseDir = __dirname + '/../..';
const importFolders = ['imports', 'server', 'client'].map(escapeStringRegexp);
const fileExtensions = ['js', 'ts', 'tsx', 'jsx'].map(escapeStringRegexp);
const output = baseDir + '/used-strings.pot';

process.env['NODE_ENV'] = 'production';
process.env['BABEL_ENV'] = 'production';

gulp.task('ts-babel', function () {
  const tsProject = ts.createProject(baseDir + '/tsconfig.json', {
    'module': 'es2015',
    'target': 'es2015',
    'jsx': 'react',
    'experimentalDecorators': true,
    'emitDecoratorMetadata': true,
    'suppressImplicitAnyIndexErrors': true,
  });
  return gulp.src(
    [
      `+(${importFolders.join('|')})/**/*.+(${fileExtensions.join('|')})`,
    ], {base: baseDir}
  )
  .pipe(tsProject(ts.reporter.nullReporter()))
  .pipe(babel({
    'plugins': [
      [
        'c-3po',
        {
          'extract': {
            'output': output,
          },
          'extractors': {
            'gettext': {
              'invalidFormat': 'skip',
            },
          }
        }
      ]
    ]
  }))
  .pipe(debug());
});

gulp.start('ts-babel');


