const express = require("express");
const Recipe = require("../models/recipe");

const router = express.Router();

router.get("/recipes", async (req, res) => {
  const recipes = await Recipe.find();
  res.send(recipes);
});

router.get("/recipe/new", (req, res) => {
  res.send("New Recipe Form");
});

router.post("/recipe", async (req, res) => {
  const recipe = new Recipe(req.body);
  await recipe.save();
  res.redirect("/recipes");
});

router.get("/recipes/:id", async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  res.send(recipe);
});

router.get("/recipes/:id/edit", async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);
  res.send("Edit Recipe: " + recipe.dishName);
});

router.put("/recipes/:id", async (req, res) => {
  await Recipe.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/recipes");
});

router.delete("/recipes/:id", async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.id);
  res.redirect("/recipes");
});

module.exports = router;
