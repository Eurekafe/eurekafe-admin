var router = require("express").Router();


module.exports = function(passport) {
  router.get("/facebook", passport.authenticate(
    "facebook", 
    {scope: ["email"]})
  );

  router.get(
    "/facebook/callback", 
    passport.authenticate(
      "facebook", 
      {failureRedirect: "fail"}
    ), 
    function(req, res) {
      res.redirect("/main/dashboard");
    }
  );

  router.get("/twitter", passport.authenticate("twitter"));

  router.get(
    "/twitter/callback", 
    passport.authenticate(
      "twitter", 
      {failureRedirect: "fail"}
    ), 
    function(req, res) {
      res.redirect("/main/dashboard");
    }
  );
  
  return router;
};
