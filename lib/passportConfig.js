const facebookStrat = require("passport-facebook").Strategy;
const twitterStrat = require("passport-twitter").Strategy;

module.exports = function(passport, dbclient) {

  return function (req, res, next) {
    passport.serializeUser(function(user, cb) {
      dbclient.then((client) => {
        let idField;
        if(user.strategy === "facebook") {
          idField = "fb_id";
        } if (user.strategy === "twitter") {
          idField = "tw_id"; 
        }
        let select = {};
        select[idField] = { $eq: user.id};
        client.db("eurekafe").collection("users").find(select).toArray((err, response) => {
          if(err) cb("Identification error =(");
          if(response.length != 0) {
            cb(null, response[0]);
          } else {
            let insert = {};
            insert[idField] = user.id;
            client.db("eurekafe").collection("users").insertOne({idField: user.id, "name": user.displayName}, (err, resp) => {
              if(err) cb("Identification error =(");
              let newUser = resp.ops[0];
              newUser.id = user.id;
              cb(null, newUser);
            });
          }    
        });
      });
    });

    passport.deserializeUser(function(user, done) {
      done(null, user);
    });

    if(process.env.FACEBOOK_ID && process.env.FACEBOOK_SECRET) {
      passport.use(new facebookStrat({
        clientID: process.env.FACEBOOK_ID,
        clientSecret: process.env.FACEBOOK_SECRET,
        callbackURL: "/auth/facebook/callback",
        profileFields: ["id", "displayName", "photos", "email"]
      },
      function(accessToken, refreshToken, profile, cb) {
        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;
        profile.strategy = "facebook";
        cb(null, profile);
      })); 
    }

    if(process.env.TWITTER_CONSUMER_KEY && process.env.TWITTER_CONSUMER_SECRET) {
      passport.use(new twitterStrat({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: "http://localhost:3001/auth/twitter/callback",
        profileFields: ["id", "displayName", "photos", "email"]
      },
      function(accessToken, refreshToken, profile, cb) {
        profile.accessToken = accessToken;
        profile.refreshToken = refreshToken;
        profile.strategy = "twitter";
        cb(null, profile);
      })); 
    }

    next();
  };
};
