import { Request, Response } from "express";

import { UnauthorizedError } from "../errors/AppError";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as recipeService from "../services/recipe.service";
import {
  CreateRecipeBody,
  UpdateRecipeBody,
} from "../utils/recipe.validation";

// ---------- Публічні GET-ендпоінти (BE-4 / BE-5) ----------

export async function getRecipes(req: Request, res: Response) {
  const { category, ingredient, area, page, limit } = req.query;

  const result = await recipeService.getRecipes({
    category: typeof category === "string" ? category : undefined,
    ingredient: typeof ingredient === "string" ? ingredient : undefined,
    area: typeof area === "string" ? area : undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });

  res.json(result);
}

export async function getRecipeById(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;
  const recipe = await recipeService.getRecipeById(id);
  res.json(recipe);
}

export async function getPopularRecipes(_req: Request, res: Response) {
  const recipes = await recipeService.getPopularRecipes();
  res.json(recipes);
}

// ---------- Приватні CRUD-ендпоінти (BE-6) ----------

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
