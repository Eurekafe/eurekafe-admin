var router = require("express").Router();
var ObjectID= require("mongodb").ObjectID;
require("express-csv");

module.exports = function(dbclient) {

  router.get("/newsletter-csv", function(req, res) {
    dbclient.then(function(client) {
      client.db("eurekafe").collection("newsletter").find().toArray(function(err, data) {
        if(err) res.redirect("/error");
        let array = [];
        data.map( (value) => {
          array.push([value.email]);
        });
        res.csv(array);
      });
    });
  });

  router.get("/getall", function(req, res) {
    dbclient.then(function(client) {
      client.db("eurekafe").collection("newsletter").find().sort({_id: -1}).toArray(function(err, data) {
        if(err) res.redirect("/error");
        res.send(data);
      });
    });
  });

  router.get("/del/:userId", function(req, res) {
    dbclient.then(function(client) {
      client.db("eurekafe").collection("newsletter").remove({_id: ObjectID(req.params.userId)}, function(err) {
        if(err) res.send("1");
        res.send("0");
      });
    });
  });

  router.get("/getlast", function(req, res) {
    dbclient.then(function(client) {
      return Promise.all([
        client.db("eurekafe").collection("newsletter").findOne({}, {sort:{$natural: -1}}),
        client.db("eurekafe").collection("newsletter").count()
      ]);
    }).then(function(result) {
      var data = {};
      data.email = result[0].email;
      data.count = result[1];
      res.send(data);
    }, function() {
      res.render("/error");
    });
  });

  router.post("/create", function(req, res) {
    dbclient.then(function(client) {
      client.db("eurekafe").collection("newsletter").insertOne({email: req.body.email}, function(err) {
        if(err) res.send("1");
        res.send("0");
      });
    });
  });

  return router;
};
