const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();

router.get('/register', (req, res) => {
  res.render('register', { formData: {} });
});

router.post('/register', async (req, res, next) => {
  const { username, password, fullName, country, dietaryPreference } = req.body;
  const errors = {};
  if (!username) errors.username = 'Username is required';
  if (!password) errors.password = 'Password is required';
  if (!fullName) errors.fullName = 'Full name is required';
  if (!country) errors.country = 'Country is required';
  if (!dietaryPreference) errors.dietaryPreference = 'Dietary preference is required';

  if (Object.keys(errors).length) {
    return res.render('register', { errors, formData: req.body });
  }

  try {
    const existing = await User.findOne({ username });
    if (existing) {
      return res.render('register', { errors: { username: 'Username already taken' }, formData: req.body });
    }
    const user = new User({ username, password, fullName, country, dietaryPreference });
    await user.save();
    req.login(user, err => {
      if (err) return next(err);
      req.flash('success', 'Registered successfully');
      res.redirect('/recipes');
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Registration failed');
    res.redirect('/register');
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', passport.authenticate('local', {
  failureRedirect: '/login',
  failureFlash: true
}), (req, res) => {
  req.flash('success', 'Logged in successfully');
  res.redirect('/recipes');
});

router.post('/logout', (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success', 'Logged out successfully');
    res.redirect('/login');
  });
});

module.exports = router;
