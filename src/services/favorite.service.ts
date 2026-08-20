import {
  findFavoritesByUserId,
  addFavorite,
  removeFavorite,
} from "../repositories/favorite.repository";
import { AppError } from "../errors/AppError";

export const getUserFavorites = async (userId: string) => {
  const result = await findFavoritesByUserId(userId);

  if (!result) {
    throw new AppError(404, "User not found");
  }

  return result.favorites;
};

export const addUserFavorite = async (
  userId: string,
  recipeId: string,
) => {
  const result = await addFavorite(userId, recipeId);

  return result.favorites;
};

export const removeUserFavorite = async (
  userId: string,
  recipeId: string,
) => {
  const result = await removeFavorite(userId, recipeId);

  return result.favorites;
};