const express = require("express"); 
const passport = require("passport"); 
const User = require("../models/user"); 

const router = express.Router(); 

// show register page
router.get("/register", (req, res) => {
  res.send("Register Page");
});

// create new user
router.post("/register", async (req, res) => {
  const user = new User(req.body); 
  await user.save(); 
  res.redirect("/login");
});

// show login page
router.get("/login", (req, res) => {
  res.send("Login Page");
});

// login user using passport
router.post("/login", passport.authenticate("local", {
  successRedirect: "/recipes", 
  failureRedirect: "/login"    
}));

// logout user
router.post("/logout", (req, res) => {
  req.logout(() => { 
    res.redirect("/login"); 
  });
});
// export router
module.exports = router; 
