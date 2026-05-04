const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const User = require('./models/user');
const userRoutes = require('./routes/user');
const recipeRoutes = require('./routes/recipe');

const app = express();
const dbUrl = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/recipeApp';



app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
  secret: 'recipe secret',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await User.findOne({ username });
    if (!user) return done(null, false, { message: 'Invalid username or password' });
    const validPassword = await user.comparePassword(password);
    if (!validPassword) return done(null, false, { message: 'Invalid username or password' });
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', userRoutes);
app.use('/', recipeRoutes);

app.get('/', (req, res) => {
  if (req.isAuthenticated()) return res.redirect('/recipes');
  res.redirect('/login');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
