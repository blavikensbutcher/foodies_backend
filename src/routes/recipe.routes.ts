import { Router } from "express";

import { APP_PATHS, RECIPE_PATHS } from "../constants/paths";
import * as recipeController from "../controllers/recipe.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRecipeOwner } from "../middlewares/recipeOwner.middleware";
import { validateUpdateRecipeBody } from "../middlewares/recipe.validate.middleware";
import { uploadRecipeImage } from "../middlewares/upload.middleware";
import { validateBody, validateParams } from "../middlewares/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { CreateRecipeSchema, RecipeParamsSchema } from "../utils/recipe.validation";

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
router.get(APP_PATHS.RECIPES, asyncHandler(recipeController.getRecipes));

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
router.get(
  `${APP_PATHS.RECIPES}/popular`,
  asyncHandler(recipeController.getPopularRecipes),
);

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
router.get(
  `${APP_PATHS.RECIPES}${RECIPE_PATHS.BY_ID}`,
  asyncHandler(recipeController.getRecipeById),
);

/**
 * @openapi
 * /recipes:
 *   post:
 *     summary: Create a new recipe
 *     description: Creates a recipe with optional main image. Ingredients must be sent as a JSON string in multipart form-data.
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - instructions
 *               - categoryId
 *               - areaId
 *               - ingredients
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 64
 *                 example: Chocolate Cake
 *               instructions:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 example: Mix ingredients and bake for 30 minutes at 180C.
 *               description:
 *                 type: string
 *                 maxLength: 200
 *                 example: A rich chocolate dessert
 *               time:
 *                 type: string
 *                 example: "30"
 *               categoryId:
 *                 type: string
 *                 example: 6462a8f74c3d0ddd28897f8a
 *               areaId:
 *                 type: string
 *                 example: 6462a6cd4c3d0ddd28897f80
 *               ingredients:
 *                 type: string
 *                 description: JSON string array of ingredients
 *                 example: '[{"id":"640c2dd963a319ea671e383b","measure":"200g"}]'
 *               mainImage:
 *                 type: string
 *                 format: binary
 *                 description: Optional recipe image (jpeg, png, webp)
 *     responses:
 *       201:
 *         description: Recipe created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category, area or ingredient not found
 *       422:
 *         description: Validation failed
 */
router.post(
  `${APP_PATHS.RECIPES}${RECIPE_PATHS.ROOT}`,
  asyncHandler(authenticate),
  uploadRecipeImage,
  validateBody(CreateRecipeSchema),
  asyncHandler(recipeController.create),
);

/**
 * @openapi
 * /recipes/{id}:
 *   patch:
 *     summary: Update own recipe
 *     description: Partially updates a recipe. Only the recipe owner can update it. At least one field or image is required.
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe id
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 3
 *                 maxLength: 64
 *                 example: Updated Chocolate Cake
 *               instructions:
 *                 type: string
 *                 minLength: 10
 *                 maxLength: 1000
 *                 example: Mix ingredients and bake for 35 minutes at 180C.
 *               description:
 *                 type: string
 *                 maxLength: 200
 *                 example: Updated description
 *               time:
 *                 type: string
 *                 example: "35"
 *               categoryId:
 *                 type: string
 *               areaId:
 *                 type: string
 *               ingredients:
 *                 type: string
 *                 description: JSON string array that fully replaces recipe ingredients
 *                 example: '[{"id":"640c2dd963a319ea671e383b","measure":"250g"}]'
 *               mainImage:
 *                 type: string
 *                 format: binary
 *                 description: Optional new recipe image
 *     responses:
 *       200:
 *         description: Recipe updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — not the recipe owner
 *       404:
 *         description: Recipe, category, area or ingredient not found
 *       422:
 *         description: Validation failed
 */
router.patch(
  `${APP_PATHS.RECIPES}${RECIPE_PATHS.BY_ID}`,
  asyncHandler(authenticate),
  validateParams(RecipeParamsSchema),
  asyncHandler(authorizeRecipeOwner),
  uploadRecipeImage,
  validateUpdateRecipeBody,
  asyncHandler(recipeController.update),
);

/**
 * @openapi
 * /recipes/{id}:
 *   delete:
 *     summary: Delete own recipe
 *     description: Deletes a recipe. Only the recipe owner can delete it.
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Recipe id
 *     responses:
 *       200:
 *         description: Recipe deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — not the recipe owner
 *       404:
 *         description: Recipe not found
 */
router.delete(
  `${APP_PATHS.RECIPES}${RECIPE_PATHS.BY_ID}`,
  asyncHandler(authenticate),
  validateParams(RecipeParamsSchema),
  asyncHandler(authorizeRecipeOwner),
  asyncHandler(recipeController.remove),
);

/**
 * @openapi
 * components:
 *   schemas:
 *     RecipeIngredient:
 *       type: object
 *       properties:
 *         measure:
 *           type: string
 *           example: 200g
 *         ingredient:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             img:
 *               type: string
 *               nullable: true
 *     Recipe:
 *       type: object
 *       description: >
 *         Форма відповіді для POST/PATCH (create/update)
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         instructions:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         mainImage:
 *           type: string
 *           nullable: true
 *         time:
 *           type: string
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         owner:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *             avatar:
 *               type: string
 *               nullable: true
 *         category:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *         area:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *             name:
 *               type: string
 *         ingredients:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RecipeIngredient'
 */

export default router;
