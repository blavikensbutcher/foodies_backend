import {
  findFavoritesByUserId,
  addFavorite,
  removeFavorite,
  findRecipeById,
} from "../repositories/favorite.repository";

import { NotFoundError } from "../errors/AppError";

export const getUserFavorites = async (userId: string) => {
  const result = await findFavoritesByUserId(userId);

  if (!result) {
    throw new NotFoundError("User not found");
  }

  return result.favorites;
};

export const addUserFavorite = async (
  userId: string,
  recipeId: string,
) => {
  const recipe = await findRecipeById(recipeId);

  if (!recipe) {
    throw new NotFoundError("Recipe not found");
  }

  const result = await addFavorite(userId, recipeId);

  return result.favorites;
};

export const removeUserFavorite = async (
  userId: string,
  recipeId: string,
) => {
  const recipe = await findRecipeById(recipeId);

  if (!recipe) {
    throw new NotFoundError("Recipe not found");
  }

  const result = await removeFavorite(userId, recipeId);

  return result.favorites;
};