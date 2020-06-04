const express = require("express");
const router = express.Router();
const search_utils = require("../utils/search_recipes");
const axios = require("axios");
const api_domain = "https://api.spoonacular.com/recipes";
const DBUtils = require("../utils/DBUtils");
const recipeUtils = require("../utils/search_recipes");



router.get("/recipeInfo", async (req, res, next) => {
  try {
    // get seen & isFavorite
    const favorite = await DBUtils.execQuery(`SELECT * FROM favoriteRecipes WHERE user_id='${req.session.id}' and recipe_id='${req.query.recipe_id}'`);
    let isFavorite = (favorite.length > 0);

    const seen = await DBUtils.execQuery(`SELECT * FROM seenRecipes WHERE user_id='${req.session.id}' and recipe_id='${req.query.recipe_id}'`);
    let wasSeen = (favorite.length > 0);

    const recipe = await recipeUtils.getRecipeInfo(req.query.recipe_id);
    let fullInfo = {
      recipe_id: recipe.data.id,
      recipeName: recipe.data.title,
      image: recipe.data.image,
      coockingTime: recipe.data.readyInMinutes,
      numberOfLikes: recipe.data.aggregateLikes,
      isVegan: recipe.data.vegan,
      isVegeterian: recipe.data.vegetarian,
      isGlutenFree: recipe.data.glutenFree,
      IngredientList: recipe.data.extendedIngredients.map(function (obj) {
        return obj.name;
      }),
      Instructions: recipe.data.Instructions,
      MealsQuantity: recipe.data.servings,
      seen: wasSeen,
      isFavorite: isFavorite
    }
    res.status(200).send({ fullInfo });

  } catch (error) {
    next(error);
  }
});


router.get("/search", async (req, res, next) => {
  try {
    //search recipes from spooncular API according to the search query and other values (like kind of cuisine etc.)
    let recipesObj = await recipeUtils.searchRecipeInfo(req);
    let recipesArray = recipesObj.data.results;
    //ask for full recipes information from the API (with the get Recipe by {id})
    var recipes = await recipeUtils.searchRecieps(recipesArray);
  }
  catch (error) {
    next(error);
  }

  res.status(200).send({ recipes });
});


router.get("/randomRecipes", async (req, res, next) => {
  try {
    let recipes;
    let instructionsInclueded = false;
    while (!instructionsInclueded) {
      instructionsInclueded = true;
      recipes = await recipeUtils.getTreeRandomRecipes();
      let recipesArray = recipes.data.recipes;

      for (var i = 0; i < 3; i++) {
        // use i as an array index
        if (recipesArray[i].instructions == null || recipesArray[i].instructions.length == 0)
          instructionsInclueded = false;
      }
    }
    res.send(recipes.data.recipes);

  }
  catch (error) {
    next(error);
  }
});



module.exports = router;
