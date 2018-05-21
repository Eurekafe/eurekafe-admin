var router = require("express").Router();
var ObjectID= require("mongodb").ObjectID;

module.exports = function(dbclient) {

  router.post("/create", function(req, res) {
    dbclient.then(function(client) {
      client.db("eurekafe").collection("event").insertOne(req.body, function(err) {
        if(err) res.send("1");
        res.send("0");
      });
    });
  });

  router.get("/all", function(req, res) {
    dbclient.then(function(client) {
      var collection = client.db("eurekafe").collection("event");
      collection.find().toArray(function(err, data) {
        if(err) res.send(err);
        res.send(data);
      });
    }).catch(function(err) {
      console.log(err);
      res.send(err);
    });
  });

  router.get("/del/:userId", function(req, res) {
    dbclient.then(function(client) {
      client.db("eurekafe").collection("event").remove({_id: ObjectID(req.params.userId)}, function(err) {
        if(err) res.send("1");
        res.send("0");
      });
    });
  });
  
  return router;
};