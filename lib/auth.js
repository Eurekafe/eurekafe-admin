var session = require("express-session");
var passport = require("passport");
var facebookStrat = require("passport-facebook").Strategy;


function auth (app) {
  var expressSession = session({
    secret: "just another secret",
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: 1800000}
  });
  app.use(expressSession);

  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, cb) {
    //require("../lib/facebook.js")(user.accessToken);
    return cb(null, user);
  });
  passport.deserializeUser(function(user, done) {
    //console.log(user, "deserialized");
    return done(null, user);
  });

  if(process.env.FACEBOOK_ID && process.env.FACEBOOK_SECRET) {
    passport.use(new facebookStrat({
      clientID: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
      callbackURL: "/auth/callback",
      profileFields: ["id", "displayName", "photos", "email"]
    },
    function(accessToken, refreshToken, profile, cb) {
      profile.accessToken = accessToken;
      profile.refreshToken = refreshToken;
      cb(null, profile);
    })); 
  }

  return function(req, res, end) {

    app.get("/auth", passport.authenticate(
      "facebook", 
      {scope: ["email", "manage_pages", "publish_pages"]})
    );

    app.get(
      "/auth/callback", 
      passport.authenticate(
        "facebook", 
        {failureRedirect: "fail"}
      ), 
      function(req, res) {
        res.redirect("/dashboard");
      }
    );

    app.use(function(req, res, next) {
      if(req.user) {
        next();
      }
      else {
        res.redirect("/");
      }
    });

    end();
  };
}


module.exports = auth;