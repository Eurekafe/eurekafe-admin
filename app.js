// app.js
/* eslint no-console: "off" */

"use strict";

require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");


const app = express();

const passportConfig = require("./lib/passportConfig");

const auth = require("./routes/auth");
const main = require("./routes/main.js");
const newsletter = require("./routes/newsletter.js");
const event = require("./routes/events.js");
const frequentation = require("./routes/frequentation.js");

app.get("*", function(req,res,next) {
  if ( !req.headers.host.match(/localhost/)
    && req.headers["x-forwarded-proto"] !== "https" ) {
    res.redirect(301, "https://" + req.headers.host);
  } else { 
    next(); 
  }
});

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

const url = process.env.MONGO_CRED;
var MongoClient = require("mongodb").MongoClient;
var dbclient = MongoClient.connect(url);

app.use(passport.initialize());
app.use(passport.session());
app.use(passportConfig(passport, dbclient));

app.use("/auth", auth(passport));
app.use("/freq", frequentation);

app.get("/", function(req,res) {
  if(req.user && req.user.role === "admin") {
    res.redirect("/main/dashboard");
  } else {
    res.render("index");
  }
});



app.use(function(req, res, next) {
  //identifie user
  if(req.user && req.user.role === "admin") {
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

app.use("/main", main);

// "APIs"
app.use("/newsletter", newsletter(dbclient));
app.use("/events", event(dbclient));


const port = process.env.PORT||3001;

app.listen(port, function() {
  console.log("\x1b[32m", "app listening on port", port, "\x1b[0m");
});
