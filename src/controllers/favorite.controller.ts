import type { Response } from "express";

import type { AuthenticatedRequest } from "../middlewares/auth.middleware";
import {
  getUserFavorites,
  addUserFavorite,
  removeUserFavorite,
} from "../services/favorite.service";

export const getFavorites = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.auth!.userId;

  const favorites = await getUserFavorites(userId);

  res.status(200).json(favorites);
};

export const addFavorite = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.auth!.userId;
  const { recipeId } = req.params;

  const favorites = await addUserFavorite(userId, recipeId as string);

  res.status(200).json(favorites);
};

export const removeFavorite = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  const userId = req.auth!.userId;
  const { recipeId } = req.params;

  const favorites = await removeUserFavorite(userId, recipeId as string);

  res.status(200).json(favorites);
};