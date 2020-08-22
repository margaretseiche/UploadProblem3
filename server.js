// Requiring necessary npm packages
const express = require("express");
const session = require("express-session");
const path = require("path");
const fs = require("fs");

// Requiring passport as we've configured it
const passport = require("./config/passport");

const multer = require("multer");
var upload = multer({ dest: "./public/images" });

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8080;
const db = require("./models");

// Creating express app and configuring middleware needed for authentication
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// We need to use sessions to keep track of our user's login status
app.use(
  session({ secret: "keyboard cat", resave: true, saveUninitialized: true })
);

app.use(passport.initialize());
app.use(passport.session());

// Requiring our routes
require("./routes/html-routes.js")(app);
require("./routes/api-routes.js")(app);
require("./routes/post-routes.js")(app);

////////////////////////////// THIS GETS C:\\FAKEPATH, DOESN'T GO TO DATABASE
// app.post("/api/user-post", upload.single("img"), (req, res, next) => {          
//         console.log(req.file);
//         console.log(req.body);
//         res.end('ok');
// });

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
      console.log(
        "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
        PORT,
        PORT
      );
    });
  });    
