import { Prisma } from "../../generated/prisma/client";

export const recipeEntitySelect = {
  id: true,
  title: true,
  instructions: true,
  description: true,
  mainImage: true,
  time: true,
  createdAt: true,
  updatedAt: true,
  owner: {
    select: {
      id: true,
      name: true,
      avatar: true,
    },
  },
  category: {
    select: {
      id: true,
      name: true,
    },
  },
  area: {
    select: {
      id: true,
      name: true,
    },
  },
  ingredients: {
    select: {
      measure: true,
      ingredient: {
        select: {
          id: true,
          name: true,
          img: true,
        },
      },
    },
  },
} as const satisfies Prisma.RecipeSelect;

export const recipeDeletedSelect = {
  id: true,
  title: true,
} as const satisfies Prisma.RecipeSelect;

export const recipeRemoveSelect = {
  ...recipeDeletedSelect,
  mainImage: true,
} as const satisfies Prisma.RecipeSelect;

export const recipeWithOwnerIdSelect = {
  ...recipeEntitySelect,
  ownerId: true,
} as const satisfies Prisma.RecipeSelect;

export const recipeOwnerSelect = {
  ownerId: true,
} as const satisfies Prisma.RecipeSelect;
