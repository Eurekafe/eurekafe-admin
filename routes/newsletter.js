var router = require("express").Router();
var ObjectID= require("mongodb").ObjectID;

module.exports = function(dbclient) {

  router.get("/", function(req, res) {
    dbclient.then(function(client) {
      client.db("eurekafe").collection("newsletter").find().toArray(function(err, data) {
        if(err) res.redirect("/error");
        res.render("newsletter", {data});
      });
    });
  });

  router.get("/del/:userId", function(req, res) {
    dbclient.then(function(client) {
      client.db("eurekafe").collection("newsletter").remove({_id: ObjectID(req.params.userId)}, function(err) {
        if(err) res.redirect("/error");
        res.redirect("/newsletter");
      });
    });
  });

  router.post("/create", function(req, res) {
    dbclient.then(function(client) {
      client.db("eurekafe").collection("newsletter").insertOne({email: req.body.email}, function(err) {
        if(err) res.redirect("/error");
        res.redirect("/newsletter");
      });
    });
  });

  router.post("/search", function(req, res) {
    var regex = new RegExp(req.body.string);
    dbclient.then(function(client) {
      client.db("eurekafe").collection("newsletter").find({email: {$regex: regex}}).toArray(function(err, results) {
        res.render("search", {results});
      });
    });
  });

  return router;
};
