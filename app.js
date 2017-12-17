// app.js
/* eslint no-console: "off" */

"use strict";

require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var session = require("express-session");
var passport = require("passport");
var facebookStrat = require("passport-facebook").Strategy;

const app = express();

app.use(morgan("tiny"));

app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static("dist"));

app.get("/", function(req,res) {
  res.render("index");
});

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


const url = process.env.MONGO_CRED;
var MongoClient = require("mongodb").MongoClient;
var dbclient = new Promise(function(resolve, reject) {
  MongoClient.connect(url, function(err, client) {
    if (err) {
      reject(err);
    }
    else {
      const db = client.db("eurekafe");
      resolve(db);
    }
  });
});

app.get("/dashboard", function(req, res) {
  dbclient.then(function(db) {
    Promise.all([
      db.collection("newsletter").findOne({}, {sort:{$natural: -1}}),
      db.collection("newsletter").count()
    ]).then(function(result) {
      var data = {};
      data.email = result[0].email;
      data.count = result[1];
      res.render("dashboard", data);
    }, function(err) {
      console.log(err);
    });
  });
});


const port = process.env.PORT||3000;

app.listen(port, function() {
  console.log("\x1b[32m", "app listening on port", port, "\x1b[0m");
});
