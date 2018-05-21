var router = require("express").Router();


module.exports = function(dbclient) {
  router.get("/getNewsNames", function(req,res) {
    dbclient.then(function(client) {
      client.db("eurekafe").collection("frontnews").find({}).project({content:0}).toArray(function(err, data) {
        res.send(data);
      });
    });
  });

  return router;
};