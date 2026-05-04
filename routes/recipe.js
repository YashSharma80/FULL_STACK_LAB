const express = require('express');
const Recipe = require('../models/recipe');
const router = express.Router();

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash('error', 'You must be logged in first');
  res.redirect('/login');
}

router.get('/recipes', ensureAuthenticated, async (req, res) => {
  const recipes = await Recipe.find();
  res.render('recipes/index', { recipes });
});

router.get('/recipe/new', ensureAuthenticated, (req, res) => {
  res.render('recipes/new', { errors: {}, formData: {} });
});

router.post('/recipe', ensureAuthenticated, async (req, res) => {
  const { dishName, ingredients, cookingTime, difficulty, instructions } = req.body;
  const errors = {};
  if (!dishName) errors.dishName = 'Dish name is required';
  if (!ingredients) errors.ingredients = 'Ingredients are required';
  if (!cookingTime || Number.isNaN(Number(cookingTime))) errors.cookingTime = 'Valid cooking time is required';
  if (!difficulty) errors.difficulty = 'Difficulty must be selected';
  if (!instructions) errors.instructions = 'Instructions are required';

  if (Object.keys(errors).length) {
    return res.render('recipes/new', { errors, formData: req.body });
  }

  try {
    const recipe = new Recipe({
      dishName,
      ingredients,
      cookingTime: Number(cookingTime),
      difficulty,
      instructions
    });
    await recipe.save();
    req.flash('success', 'Recipe created successfully');
    res.redirect('/recipes');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not save recipe');
    res.redirect('/recipe/new');
  }
});

router.get('/recipes/:id', ensureAuthenticated, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    req.flash('error', 'Recipe not found');
    return res.redirect('/recipes');
  }
  res.render('recipes/show', { recipe });
});

router.get('/recipes/:id/edit', ensureAuthenticated, async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    req.flash('error', 'Recipe not found');
    return res.redirect('/recipes');
  }
  res.render('recipes/edit', { recipe, errors: {}, formData: recipe });
});

router.put('/recipes/:id', ensureAuthenticated, async (req, res) => {
  const { ingredients, cookingTime, difficulty, instructions } = req.body;
  const errors = {};
  if (!ingredients) errors.ingredients = 'Ingredients are required';
  if (!cookingTime || Number.isNaN(Number(cookingTime))) errors.cookingTime = 'Valid cooking time is required';
  if (!difficulty) errors.difficulty = 'Difficulty must be selected';
  if (!instructions) errors.instructions = 'Instructions are required';

  const recipe = await Recipe.findById(req.params.id);
  if (!recipe) {
    req.flash('error', 'Recipe not found');
    return res.redirect('/recipes');
  }

  if (Object.keys(errors).length) {
    return res.render('recipes/edit', { recipe, errors, formData: { ...req.body, dishName: recipe.dishName } });
  }

  recipe.ingredients = ingredients;
  recipe.cookingTime = Number(cookingTime);
  recipe.difficulty = difficulty;
  recipe.instructions = instructions;
  await recipe.save();
  req.flash('success', 'Recipe updated successfully');
  res.redirect(`/recipes/${recipe.id}`);
});

router.delete('/recipes/:id', ensureAuthenticated, async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.id);
  req.flash('success', 'Recipe deleted successfully');
  res.redirect('/recipes');
});

module.exports = router;
