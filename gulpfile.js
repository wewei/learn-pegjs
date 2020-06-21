const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', () =>
  tsProject.src().pipe(tsProject()).pipe(gulp.dest('dist'))
);

gulp.task('watchOnly', () => {
  gulp.watch('src/**/*.ts', gulp.series('scripts'));
});

gulp.task('watch', gulp.series('scripts', 'watchOnly'));
