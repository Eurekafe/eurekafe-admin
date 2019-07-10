var router = require("express").Router();
var ObjectID= require("mongodb").ObjectID;

module.exports = function(dbclient) {
  const eventCollection = process.env.NODE_ENV === "production" ? "event" : "event-test";
  router.post("/create", function(req, res) {
    req.body.date = new Date(req.body.date);
    dbclient.then(function(client) {
      client.db("eurekafe").collection(eventCollection).insertOne(req.body, function(err) {
        if(err) res.send("1");
        res.send("0");
      });
    });
  });

  router.get("/all", function(req, res) {
    dbclient.then(function(client) {
      var collection = client.db("eurekafe").collection(eventCollection);
      collection.find().sort({date: -1}).toArray(function(err, data) {
        if(err) res.send(err);
        res.send(data);
      });
    }).catch(function(err) {
      res.send(err);
    });
  });

  router.get("/del/:id", function(req, res) {
    dbclient.then(function(client) {
      client.db("eurekafe").collection(eventCollection).remove({_id: ObjectID(req.params.id)}, function(err) {
        if(err) res.send("1");
        res.send("0");
      });
    });
  });
  
  return router;
};