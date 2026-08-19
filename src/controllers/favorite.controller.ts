import type { Request, Response } from "express";
import { getUserFavorites } from "../services/favorite.service";

export const getFavorites = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  const { id } = req.params;

  const favorites = await getUserFavorites(id);

  res.status(200).json(favorites);
};