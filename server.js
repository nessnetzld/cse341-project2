const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./data/database");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const passport = require("passport");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
// Basic express basic session initialization
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize()); // init passport on every route call
app.use(passport.session()); // allow passport to use "express-session".

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Z-Key"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

// Middleware
app.use(cors({ methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"] }));
app.use(cors({ origin: "*" }));
app.use("/", require("./routes"));

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ githubIs: profile.id }, function (err, user) {
      return done(null, profile);
      //})
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

app.get("/", (req, res) => {
  if (req.session.user != undefined) {
    const name =
      req.session.user.displayName || req.session.user.username || "Unknown";
    res.send(`Logged in as ${name}`);
  } else {
    res.send("Logged Out");
  }
});

app.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-docs",
  }),
  (req, res) => {
    req.session.user = {
      displayName: req.user.displayName,
      username: req.user.username,
      id: req.user.id,
      profileUrl: req.user.profileUrl,
    };
    res.redirect("/");
  }
);

process.on("uncaughtException", (err, origin) => {
  console.log(
    process.stderr.fd,
    `Caught exception: ${err}\n` + `Exception origin: ${origin}`
  );
});

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    const db = mongodb.getDatabase();
    app.listen(port, () =>
      console.log(`Database is listening and node Running on port ${port}`)
    );
  }
});
