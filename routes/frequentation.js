var router = require("express").Router();

var frequentation = null;

router.get("/get", function(req,res) {
  console.log(frequentation);
  res.send(frequentation);
});

router.use(function(req, res, next) {
  if(req.user) {
    next();
  }
  else {
    res.redirect("/");
  }
});

router.post("/set", function(req, res) {
  console.log(req.body.freq);
  frequentation = req.body.freq;
  res.redirect("/");
});

module.exports = router;
