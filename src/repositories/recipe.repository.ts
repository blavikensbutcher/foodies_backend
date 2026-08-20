import prisma from "../lib/prisma";

export interface RecipeFilters {
  categoryName?: string;
  areaName?: string;
  ingredientId?: string;
}

const recipeListSelect = {
  id: true,
  title: true,
  thumb: true,
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
  thumb: string | null;
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
    ...recipe,
    category: recipe.category.name,
    area: recipe.area.name,
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

/**
 * TODO(BE-7): наразі немає моделі Favorite в схемі, тому "популярність"
 * тимчасово визначається як "останні додані рецепти". Коли з'явиться
 * модель Favorite дороблю)
 */
export async function findPopular(take: number) {
  const recipes = await prisma.recipe.findMany({
    select: recipeListSelect,
    take,
    orderBy: { createdAt: "desc" },
  });

  return recipes.map(toListItem);
}
