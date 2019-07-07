const gulp = require("gulp");
const nodemon = require("nodemon");



exports.server = function server() {
  gulp.series("build");
  gulp.watch("src/**", gulp.series("build"));
  nodemon({
    script: "app.js",
    watch: ["app.js", "routes/", "lib/", ".env"],
    ext: "js"
  }).on("restart", () => {
    console.log("Change detected... restarting server...");
  });

  // let config = {
  //   server: "dist",
  //   middleware: [
  //     webpackDevMiddleware(bundler, { /* options */ }),
  //     webpackHotMiddleware(bundler)
  //   ],
  // };

  // browser.init(config);

  // gulp.watch("src/**/*").on("change", () => browser.reload());
};