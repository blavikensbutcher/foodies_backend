import { Router } from "express";

import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../controllers/favorite.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";

const favoriteRouter = Router();

favoriteRouter.get(
  "/favorites",
  authenticate,
  asyncHandler(getFavorites),
);

favoriteRouter.post(
  "/favorites/:recipeId",
  authenticate,
  asyncHandler(addFavorite),
);

favoriteRouter.delete(
  "/favorites/:recipeId",
  authenticate,
  asyncHandler(removeFavorite),
);

export default favoriteRouter;