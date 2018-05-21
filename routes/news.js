var router = require("express").Router();


module.exports = function(dbclient) {
  router.get("/get", function(req,res) {
    res.send("get 10 news");
  });

  router.get("/getfront", function(req,res) {
    res.send("get front news");
  });

  router.use(function(req, res, next) {
    if(req.user) {
      next();
    }
    else {
      res.redirect("/");
    }
  });

  router.post("/new", function(req, res) {
    dbclient.then(function(client) {
      client.db("eurekafe").collection("frontnews").insertOne({title: req.body.title, content: req.body.content}).then(function() {
        res.redirect("/");
      }, function() {
        res.render("/error");
      });
    });
  });

  router.post("/update", function(req, res) {
    res.send("TODO");
  });

  router.post("/delete", function(req, res) {
    res.send("TODO");
  });

  module.exports = router;

  return router;
};
