import { Response } from "express";

import { UnauthorizedError } from "../errors/AppError";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as recipeService from "../services/recipe.service";
import {
  CreateRecipeBody,
  UpdateRecipeBody,
} from "../utils/recipe.validation";

const getAuthUserId = (req: AuthenticatedRequest) => {
  const userId = req.auth?.userId;

  if (!userId) {
    throw new UnauthorizedError("Authenticated user is missing");
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

export const update = async (req: AuthenticatedRequest, res: Response) => {
  const recipe = await recipeService.updateRecipe(
    req.params.id as string,
    req.body as UpdateRecipeBody,
    req.file,
  );

  res.json(recipe);
};

export const remove = async (req: AuthenticatedRequest, res: Response) => {
  const recipe = await recipeService.deleteRecipe(req.params.id as string);

  res.json(recipe);
};
