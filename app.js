const express = require("express");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/recipeApp");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Home Page");
});

app.get("/recipes", (req, res) => {
  res.send("All Recipes");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
