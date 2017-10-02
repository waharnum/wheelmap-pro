const gulp = require("gulp");
const ts = require("gulp-typescript");
const babel = require("gulp-babel");
const debug = require('gulp-debug');

gulp.task("ts-babel", function () {
  const tsProject = ts.createProject(__dirname + "/../../tsconfig.json", {
    "module": "es2015",
    "target": "es2015",
    "jsx": "react",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  });
  return gulp.src([
    "+(imports|server|client)/**/*.+(js|ts|tsx|jsx)",], {base: __dirname + "/../.."})
  .pipe(tsProject())
  .pipe(babel({
    "plugins": [
      [
        "c-3po",
        {
          "extract": {
            "output": __dirname + "/../../used-strings.pot",
          },
          "extractors": {
            "gettext": {
              "invalidFormat": 'skip',
            },
          }
        }
      ]
    ]
  }))
  .pipe(debug());
});

gulp.start('ts-babel');
