import prisma from "../lib/prisma";

export const findFavoritesByUserId = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      likedRecipes: true,
    },
  });
};

export const findRecipeById = async (recipeId: string) => {
  return prisma.recipe.findUnique({
    where: { id: recipeId },
  });
};

export const addFavorite = async (
  userId: string,
  recipeId: string,
) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      likedRecipes: {
        connect: { id: recipeId },
      },
    },
    select: {
      likedRecipes: true,
    },
  });
};

export const removeFavorite = async (
  userId: string,
  recipeId: string,
) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      likedRecipes: {
        disconnect: { id: recipeId },
      },
    },
    select: {
      likedRecipes: true,
    },
  });
};