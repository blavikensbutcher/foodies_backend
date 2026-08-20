import * as recipeRepository from "../repositories/recipe.repository";
import { NotFoundError } from "../errors/AppError";
import { ERROR_MESSAGES } from "../errors/error.constants";

export interface GetRecipesParams {
  category?: string;
  ingredient?: string;
  area?: string;
  page?: number;
  limit?: number;
}

const DEFAULT_LIMIT = 12;
const POPULAR_LIMIT = 4;

export async function getRecipes(params: GetRecipesParams) {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  const { items, total } = await recipeRepository.findMany(
    {
      categoryName: params.category,
      areaName: params.area,
      ingredientId: params.ingredient,
    },
    skip,
    limit,
  );

  return {
    recipes: items,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getRecipeById(id: string) {
  const recipe = await recipeRepository.findById(id);

  if (!recipe) {
    throw new NotFoundError(ERROR_MESSAGES.RECIPE_NOT_FOUND);
  }

  return recipe;
}

export function getPopularRecipes() {
  return recipeRepository.findPopular(POPULAR_LIMIT);
}
