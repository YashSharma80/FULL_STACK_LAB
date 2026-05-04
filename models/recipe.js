const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  dishName: { type: String, required: true, immutable: true },
  ingredients: { type: String, required: true },
  cookingTime: { type: Number, required: true },
  difficulty: { type: String, required: true, enum: ['Easy', 'Medium', 'Hard'] },
  instructions: { type: String, required: true }
});

module.exports = mongoose.model('Recipe', recipeSchema);
