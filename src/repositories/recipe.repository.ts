import prisma from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";
import { PrismaPagination } from "../types/pagination.types";
import {
  recipeCardSelect,
  recipeEntitySelect,
  recipeOwnerSelect,
  recipeRemoveSelect,
  recipeWithOwnerIdSelect,
} from "../types/recipe";
import { CreateRecipeBody, UpdateRecipeBody } from "../utils/recipe.validation";

export const findCardsPage = async (
  where: Prisma.RecipeWhereInput,
  currentUserId: string,
  { skip, take }: PrismaPagination,
) => {
  const [items, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      select: recipeCardSelect(currentUserId),
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      skip,
      take,
    }),
    prisma.recipe.count({ where }),
  ]);

  return { items, total };
};

export const findById = (id: string) => {
  return prisma.recipe.findUnique({
    where: { id },
    select: recipeWithOwnerIdSelect,
  });
};

export const findOwnerById = (id: string) => {
  return prisma.recipe.findUnique({
    where: { id },
    select: recipeOwnerSelect,
  });
};

export const create = (
  data: CreateRecipeBody & { id: string; ownerId: string; mainImage?: string },
) => {
  const { ingredients, ...recipeData } = data;

  return prisma.recipe.create({
    data: {
      ...recipeData,
      ingredients: {
        create: ingredients.map((ingredient) => ({
          measure: ingredient.measure,
          ingredient: { connect: { id: ingredient.id } },
        })),
      },
    },
    select: recipeEntitySelect,
  });
};

export const update = (id: string, data: UpdateRecipeBody & { mainImage?: string | null }) => {
  const { ingredients, ...recipeData } = data;

  return prisma.recipe.update({
    where: { id },
    data: {
      ...recipeData,
      ...(ingredients && {
        ingredients: {
          deleteMany: {},
          create: ingredients.map((ingredient) => ({
            measure: ingredient.measure,
            ingredient: { connect: { id: ingredient.id } },
          })),
        },
      }),
    },
    select: recipeEntitySelect,
  });
};

export const remove = async (id: string) => {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    select: recipeRemoveSelect,
  });

  if (!recipe) {
    return null;
  }

  await prisma.recipe.delete({ where: { id } });

  return recipe;
};
