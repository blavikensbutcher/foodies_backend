import { Router } from "express";
import * as recipeController from "../controllers/recipe.controller";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

/**
 * @openapi
 * /recipes:
 *   get:
 *     summary: Get a paginated list of recipes with optional filters
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category name
 *       - in: query
 *         name: ingredient
 *         schema:
 *           type: string
 *         description: Filter by ingredient id
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *         description: Filter by area name
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 12
 *     responses:
 *       200:
 *         description: Paginated list of recipes
 */
router.get("/recipes", asyncHandler(recipeController.getRecipes));

/**
 * @openapi
 * /recipes/popular:
 *   get:
 *     summary: Get the most popular recipes
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: List of popular recipes
 */
router.get("/recipes/popular", asyncHandler(recipeController.getPopularRecipes));

/**
 * @openapi
 * /recipes/{id}:
 *   get:
 *     summary: Get a recipe by id
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: The requested recipe
 *       404:
 *         description: Recipe not found
 */
router.get("/recipes/:id", asyncHandler(recipeController.getRecipeById));

export default router;
