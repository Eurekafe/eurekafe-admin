const gulp = require("gulp");

const { scripts } = require("./webpack");
const { server }  = require ("./server");

exports.dev = gulp.series( scripts, server );
exports.build = gulp.series( scripts );

exports.default = gulp.series( scripts );
