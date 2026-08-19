import { NextFunction, Response } from "express";

import { ForbiddenError, NotFoundError } from "../errors/AppError";
import { ERROR_MESSAGES } from "../errors/error.constants";
import * as recipeRepository from "../repositories/recipe.repository";
import { RecipeParams } from "../utils/recipe.validation";
import { AuthenticatedRequest } from "./auth.middleware";

export const authorizeRecipeOwner = async (
  req: AuthenticatedRequest<RecipeParams>,
  _res: Response,
  next: NextFunction,
) => {
  const userId = req.auth?.userId;

  if (!userId) {
    next(new ForbiddenError(ERROR_MESSAGES.FORBIDDEN));
    return;
  }

  const recipe = await recipeRepository.findOwnerById(req.params.id);

  if (!recipe) {
    next(new NotFoundError(ERROR_MESSAGES.RECIPE_NOT_FOUND));
    return;
  }

  if (recipe.ownerId !== userId) {
    next(new ForbiddenError(ERROR_MESSAGES.FORBIDDEN));
    return;
  }

  next();
};
