const mongoose = require('mongoose'); // import mongoose

// define schema (structure of recipe data)
const recipeSchema = new mongoose.Schema({
  dishName: { type: String, required: true, immutable: true }, // name of dish (cannot be changed)
  ingredients: { type: String, required: true }, // ingredients required
  cookingTime: { type: Number, required: true }, // time to cook (number)
  difficulty: { type: String, required: true, enum: ['Easy', 'Medium', 'Hard'] }, // difficulty level
  instructions: { type: String, required: true } // cooking steps
});

// create and export model
module.exports = mongoose.model('Recipe', recipeSchema);
