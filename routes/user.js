const express = require("express");
const passport = require("passport");
const User = require("../models/user");

const router = express.Router();

router.get("/register", (req, res) => {
  res.send("Register Page");
});

router.post("/register", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.redirect("/login");
});

router.get("/login", (req, res) => {
  res.send("Login Page");
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/recipes",
  failureRedirect: "/login"
}));

router.post("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/login");
  });
});

module.exports = router;
