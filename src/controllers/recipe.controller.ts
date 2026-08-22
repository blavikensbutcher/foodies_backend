import { Request, Response } from "express";

import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import * as recipeService from "../services/recipe.service";
import { addUserFavorite, removeUserFavorite } from "../services/favorite.service";
import { CreateRecipeBody, UpdateRecipeBody } from "../utils/recipe.validation";

import { getAuthUserId } from "../utils/auth.context";
import { paginationSchema } from "../utils/pagination";
import { RecipeListPage } from "../types/recipe";


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


export const getOwnRecipes = async (req: AuthenticatedRequest, res: Response<RecipeListPage>) => {
  const currentUserId = getAuthUserId(req);
  const pagination = paginationSchema.parse(req.query);

  res.json(await recipeService.getOwnRecipes(currentUserId, pagination));
};

export const getFavoriteRecipes = async (
  req: AuthenticatedRequest,
  res: Response<RecipeListPage>,
) => {
  const currentUserId = getAuthUserId(req);
  const pagination = paginationSchema.parse(req.query);

  res.json(await recipeService.getFavoriteRecipes(currentUserId, pagination));
};

export const favoriteRecipe = async (
  req: AuthenticatedRequest<{ recipeId: string }>,
  res: Response<{ recipeId: string; isFavorite: boolean }>,
) => {
  const currentUserId = getAuthUserId(req);
  const { recipeId } = req.params;

  await addUserFavorite(currentUserId, recipeId);

  res.status(201).json({ recipeId, isFavorite: true });
};

export const unfavoriteRecipe = async (
  req: AuthenticatedRequest<{ recipeId: string }>,
  res: Response<{ recipeId: string; isFavorite: boolean }>,
) => {
  const currentUserId = getAuthUserId(req);
  const { recipeId } = req.params;

  await removeUserFavorite(currentUserId, recipeId);

  res.json({ recipeId, isFavorite: false });
};

export const getUserRecipes = async (
  req: AuthenticatedRequest<{ id: string }>,
  res: Response<RecipeListPage>,
) => {
  const currentUserId = getAuthUserId(req);
  const pagination = paginationSchema.parse(req.query);

  res.json(await recipeService.getUserRecipes(req.params.id, currentUserId, pagination));
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
