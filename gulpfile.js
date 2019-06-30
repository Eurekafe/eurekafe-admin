//gulpfile.js
/* eslint no-console: "off" */

"use strict";

var gulp = require("gulp");
var gutil = require("gulp-util");
var nodemon = require("nodemon");
var webpack = require("webpack");
var UglifyJSPlugin = require("uglifyjs-webpack-plugin");

var webpackConfig = require("./webpack.config.js");


var config = Object.create(webpackConfig);
config.devtool = "inline-source-map";
var devCompiler = webpack(config);

gulp.task("webpack:build", gulp.series(function(callback) {
  // run webpack
  devCompiler.run(function(err, stats) {
    if(err) throw new gutil.PluginError("webpack:build", err);
    gutil.log("[webpack:build]", stats.toString({
      colors: true
    }));
    callback();
  });
}));


gulp.task("build-dev", gulp.parallel("webpack:build", () => gulp.watch(["src/**/*"])));

gulp.task("server-dev", gulp.series("build-dev", function() {
  // configure nodemon
  nodemon({
    // the script to run the app
    script: "app.js",
    // this listens to changes in any of these files/routes and restarts the application
    watch: ["app.js", "routes/", "lib/", ".env"],
    ext: "js"
  }).on("restart", () => {
    console.log("Change detected... restarting server...");
    gulp.src("server.js");
  });
}));



gulp.task("default", gulp.series("server-dev"));

var configProd = Object.create(webpackConfig);
configProd.plugins.push(new UglifyJSPlugin());

// create a single instance of the compiler to allow caching
var prodCompiler = webpack(config);


gulp.task("webpack:build-prod", gulp.series(function(callback) {
  // run webpack
  prodCompiler.run(function(err, stats) {
    if(err) throw new gutil.PluginError("webpack:build-prod", err);
    gutil.log("[webpack:build-prod]", stats.toString({
      colors: true
    }));
    callback();
  });
})
);

gulp.task("build", gulp.series("webpack:build-prod"));





// create a single instance of the compiler to allow caching







