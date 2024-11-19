const express = require("express");
const app = express();
const port = 3000;
const User_model = require("./model/user");
const session = require("express-session");
const passport = require("passport");
// const passport_local_mongoose = require("passport-local-mongoose");
const Localpassport = require("passport-local");
const UserRoutes = require("./routes/user");
const path = require("path");
const ejs = require("ejs");
const cors = require("cors");
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //help to get the data form body
app.use(express.static(path.join(__dirname, "public")));
// app.use(methodOverride("_method"));
// app.engine("ejs", ejs);
app.set("view engine", "ejs");

app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend's URL
    credentials: true,
  })
);

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "1234xyz",
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localpassport(User_model.authenticate()));
passport.serializeUser(User_model.serializeUser());
passport.deserializeUser(User_model.deserializeUser());

// routes
app.get("/", (req, res) => {
  res.render("../views/index.ejs");
});
app.use("/api", UserRoutes);

app.listen(port);
console.log("Server is running on port", port);
