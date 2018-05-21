// app.js
/* eslint no-console: "off" */

"use strict";

require("dotenv").config();

const request = require("request");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const facebookStrat = require("passport-facebook").Strategy;

const app = express();

app.use(morgan("tiny"));

app.set("view engine", "pug");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static("dist"));

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
  cb(null, user);
});
passport.deserializeUser(function(user, done) {
  done(null, user);
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

app.get("/", function(req,res) {
  if(req.user) {
    res.redirect("/main/dashboard");
  } else {
    res.render("index");
  }
});

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
    res.redirect("/main/dashboard");
  }
);

const frequentation = require("./routes/frequentation.js");

app.use("/freq", frequentation);

app.use(function(req, res, next) {
  if(req.user) {
    next();
  }
  else {
    res.redirect("/");
  }
});

app.get("/logout", function(req, res) {
  req.logOut();
  res.redirect("/");
});

const url = process.env.MONGO_CRED;
var MongoClient = require("mongodb").MongoClient;

var dbclient = MongoClient.connect(url);

const newsletter = require("./routes/newsletter.js")(dbclient);
app.use("/newsletter", newsletter);

const articles = require("./routes/articles.js")(dbclient);
app.use("/articles", articles);

const event = require("./routes/events.js")(dbclient);
app.use("/events", event);

app.get("/dashboard", function(req, res) {
  res.render("main");
});

const main = require("./routes/main.js");

app.use("/main", main);

const port = process.env.PORT||3000;

app.listen(port, function() {
  console.log("\x1b[32m", "app listening on port", port, "\x1b[0m");
});
