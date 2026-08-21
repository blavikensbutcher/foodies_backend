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

// Cards for the profile lists: own recipes, favorites, another user's recipes.
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

// ---------- Публічні GET-ендпоінти (BE-4 / BE-5) ----------

export interface RecipeFilters {
  categoryName?: string;
  areaName?: string;
  ingredientId?: string;
}

const recipeListSelect = {
  id: true,
  title: true,
  mainImage: true,
  time: true,
  description: true,
  category: { select: { name: true } },
  area: { select: { name: true } },
  owner: { select: { id: true, name: true, avatar: true } },
} as const;

const recipeDetailSelect = {
  ...recipeListSelect,
  instructions: true,
  createdAt: true,
  ingredients: {
    select: {
      measure: true,
      ingredient: { select: { id: true, name: true, img: true } },
    },
  },
} as const;

interface RecipeListRow {
  id: string;
  title: string;
  mainImage: string | null;
  time: string | null;
  description: string | null;
  category: { name: string };
  area: { name: string };
  owner: { id: string; name: string; avatar: string | null };
}

interface RecipeDetailRow extends RecipeListRow {
  instructions: string;
  createdAt: Date;
  ingredients: {
    measure: string | null;
    ingredient: { id: string; name: string; img: string | null };
  }[];
}

function buildWhere(filters: RecipeFilters) {
  return {
    ...(filters.categoryName && { category: { name: filters.categoryName } }),
    ...(filters.areaName && { area: { name: filters.areaName } }),
    ...(filters.ingredientId && {
      ingredients: { some: { ingredientId: filters.ingredientId } },
    }),
  };
}


function toListItem(recipe: RecipeListRow) {
  return {
    id: recipe.id,
    title: recipe.title,
    thumb: recipe.mainImage,
    time: recipe.time,
    description: recipe.description,
    category: recipe.category.name,
    area: recipe.area.name,
    owner: recipe.owner,
  };
}

function toDetail(recipe: RecipeDetailRow) {
  return {
    ...toListItem(recipe),
    instructions: recipe.instructions,
    createdAt: recipe.createdAt,
    ingredients: recipe.ingredients.map((item) => ({
      id: item.ingredient.id,
      name: item.ingredient.name,
      img: item.ingredient.img,
      measure: item.measure,
    })),
  };
}

export async function findMany(filters: RecipeFilters, skip: number, take: number) {
  const where = buildWhere(filters);

  const [items, total] = await Promise.all([
    prisma.recipe.findMany({
      where,
      select: recipeListSelect,
      skip,
      take,
      orderBy: { createdAt: "desc" },
    }),
    prisma.recipe.count({ where }),
  ]);

  return { items: items.map(toListItem), total };
}

export async function findById(id: string) {
  const recipe = await prisma.recipe.findUnique({
    where: { id },
    select: recipeDetailSelect,
  });

  return recipe ? toDetail(recipe) : null;
}


export async function findPopular(take: number) {
  const recipes = await prisma.recipe.findMany({
    select: recipeListSelect,
    take,
    orderBy: { favoredBy: { _count: "desc" } },
  });

  return recipes.map(toListItem);
}

// ---------- Приватні CRUD-ендпоінти (BE-6) ----------

export const findOwnerById = (id: string) => {
  return prisma.recipe.findUnique({
    where: { id },
    select: recipeOwnerSelect,
  });
};


export const findEntityById = (id: string) => {
  return prisma.recipe.findUnique({
    where: { id },
    select: recipeWithOwnerIdSelect,
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

export const update = (
  id: string,
  data: UpdateRecipeBody & { mainImage?: string | null },
) => {
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
