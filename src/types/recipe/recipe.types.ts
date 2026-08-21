import { Prisma } from "../../generated/prisma/client";

import {
  recipeCardSelect,
  recipeDeletedSelect,
  recipeEntitySelect,
  recipeRemoveSelect,
  recipeWithOwnerIdSelect,
} from "./recipe.selects";

export type RecipeEntity = Prisma.RecipeGetPayload<{
  select: typeof recipeEntitySelect;
}>;

export type RecipeDeletedResponse = Prisma.RecipeGetPayload<{
  select: typeof recipeDeletedSelect;
}>;

export type RecipeRemoveResult = Prisma.RecipeGetPayload<{
  select: typeof recipeRemoveSelect;
}>;

export type RecipeWithOwnerId = Prisma.RecipeGetPayload<{
  select: typeof recipeWithOwnerIdSelect;
}>;

export type RecipeCardRow = Prisma.RecipeGetPayload<{
  select: ReturnType<typeof recipeCardSelect>;
}>;
