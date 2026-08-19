import { findFavoritesByUserId } from "../repositories/favorite.repository";

export const getUserFavorites = async (id: string) => {
  const result = await findFavoritesByUserId(id);
  if (result === null) {
  }
  return getUserFavorites;
};
