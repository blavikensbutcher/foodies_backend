import { Router } from "express";

import { APP_PATHS, RECIPE_PATHS } from "../constants/paths";
import * as recipeController from "../controllers/recipe.controller";
// import { authenticate } from "../middlewares/auth.middleware";
import { authorizeRecipeOwner } from "../middlewares/recipeOwner.middleware";
import { validateUpdateRecipeBody } from "../middlewares/recipe.validate.middleware";
import { uploadRecipeImage } from "../middlewares/upload.middleware";
import { validateBody, validateParams } from "../middlewares/validate.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { CreateRecipeSchema, RecipeParamsSchema } from "../utils/recipe.validation";

const router = Router();

router.post(
  `${APP_PATHS.RECIPES}${RECIPE_PATHS.ROOT}`,
  // authenticate,
  uploadRecipeImage,
  validateBody(CreateRecipeSchema),
  asyncHandler(recipeController.create),
);

router.patch(
  `${APP_PATHS.RECIPES}${RECIPE_PATHS.BY_ID}`,
  // authenticate,
  validateParams(RecipeParamsSchema),
  asyncHandler(authorizeRecipeOwner),
  uploadRecipeImage,
  validateUpdateRecipeBody,
  asyncHandler(recipeController.update),
);

router.delete(
  `${APP_PATHS.RECIPES}${RECIPE_PATHS.BY_ID}`,
  // authenticate,
  validateParams(RecipeParamsSchema),
  asyncHandler(authorizeRecipeOwner),
  asyncHandler(recipeController.remove),
);

export default router;
