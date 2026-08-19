import { Response } from "express";

import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as recipeService from "../services/recipe.service";
import {
  CreateRecipeBody,
  RecipeParams,
  UpdateRecipeBody,
} from "../utils/recipe.validation";

const getAuthUserId = (req: AuthenticatedRequest) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new Error("Authenticated user is missing");
  }

  return userId;
};

export const create = async (req: AuthenticatedRequest, res: Response) => {
  const recipe = await recipeService.createRecipe(
    getAuthUserId(req),
    req.body as CreateRecipeBody,
    req.file,
  );

  res.status(201).json(recipe);
};

export const update = async (
  req: AuthenticatedRequest<RecipeParams>,
  res: Response,
) => {
  const recipe = await recipeService.updateRecipe(
    req.params.id,
    req.body as UpdateRecipeBody,
    req.file,
  );

  res.json(recipe);
};

export const remove = async (
  req: AuthenticatedRequest<RecipeParams>,
  res: Response,
) => {
  const recipe = await recipeService.deleteRecipe(req.params.id);

  res.json(recipe);
};
