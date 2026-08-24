import { randomUUID } from "crypto";
import { Prisma } from "../generated/prisma/client";
import { getUserById } from "./user.service";
import { buildPageMeta, Pagination, toPrismaPagination } from "../utils/pagination";
import { RecipeCard, RecipeCardRow, RecipeDeletedResponse, RecipeListPage } from "../types/recipe";
import { NotFoundError, BadRequestError } from "../errors/AppError";
import { ERROR_MESSAGES } from "../errors/error.constants";
import { CLOUDINARY_RECIPES_FOLDER } from "../constants/uploads";
import * as areaRepository from "../repositories/area.repository";
import * as categoryRepository from "../repositories/category.repository";
import * as ingredientRepository from "../repositories/ingredient.repository";
import * as recipeRepository from "../repositories/recipe.repository";
import { deleteFile, uploadFile } from "./upload.service";
import { CreateRecipeBody, UpdateRecipeBody } from "../utils/recipe.validation";

function toRecipeCard(recipe: RecipeCardRow): RecipeCard {
  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description,
    mainImage: recipe.mainImage,
    time: recipe.time,
    owner: recipe.owner,
    isFavorite: recipe.favoredBy.length > 0,
  };
}

async function getRecipeCardsPage(
  where: Prisma.RecipeWhereInput,
  currentUserId: string,
  pagination: Pagination,
): Promise<RecipeListPage> {
  const { items, total } = await recipeRepository.findCardsPage(
    where,
    currentUserId,
    toPrismaPagination(pagination),
  );

  return {
    recipes: items.map(toRecipeCard),
    ...buildPageMeta(total, pagination),
  };
}

export const getOwnRecipes = (currentUserId: string, pagination: Pagination) =>
  getRecipeCardsPage({ ownerId: currentUserId }, currentUserId, pagination);

export const getFavoriteRecipes = (currentUserId: string, pagination: Pagination) =>
  getRecipeCardsPage({ favoredBy: { some: { id: currentUserId } } }, currentUserId, pagination);

export const getUserRecipes = async (
  ownerId: string,
  currentUserId: string,
  pagination: Pagination,
): Promise<RecipeListPage> => {
  await getUserById(ownerId);

  return getRecipeCardsPage({ ownerId }, currentUserId, pagination);
};


export interface GetRecipesParams {
  category?: string;
  ingredient?: string;
  area?: string;
  page?: number;
  limit?: number;
}

const DEFAULT_LIMIT = 12;
const POPULAR_LIMIT = 4;

export async function getRecipes(params: GetRecipesParams) {
  const page = params.page && params.page > 0 ? params.page : 1;
  const limit = params.limit && params.limit > 0 ? params.limit : DEFAULT_LIMIT;
  const skip = (page - 1) * limit;

  const { items, total } = await recipeRepository.findMany(
    {
      categoryId: params.category,
      areaId: params.area,
      ingredientId: params.ingredient,
    },
    skip,
    limit,
  );

  return {
    recipes: items,
    total,
    page,
    limit,
    totalPages: Math.max(1, Math.ceil(total / limit)),
  };
}

export async function getRecipeById(id: string, currentUserId?: string) {
  const recipe = await recipeRepository.findById(id, currentUserId);

  if (!recipe) {
    throw new NotFoundError(ERROR_MESSAGES.RECIPE_NOT_FOUND);
  }

  return recipe;
}

export function getPopularRecipes() {
  return recipeRepository.findPopular(POPULAR_LIMIT);
}


const ensureCategoryExists = async (categoryId: string) => {
  const category = await categoryRepository.findById(categoryId);

  if (!category) {
    throw new NotFoundError(ERROR_MESSAGES.CATEGORY_NOT_FOUND);
  }
};

const ensureAreaExists = async (areaId: string) => {
  const area = await areaRepository.findById(areaId);

  if (!area) {
    throw new NotFoundError(ERROR_MESSAGES.AREA_NOT_FOUND);
  }
};

const ensureIngredientsExist = async (ingredients: Array<{ id: string }>) => {
  const existingIngredients = await ingredientRepository.findByIds(
    ingredients.map((item) => item.id),
  );

  if (existingIngredients.length !== ingredients.length) {
    throw new NotFoundError(ERROR_MESSAGES.INGREDIENT_NOT_FOUND);
  }
};

export const createRecipe = async (
  userId: string,
  data: CreateRecipeBody,
  image?: Express.Multer.File,
) => {
  if (!image) {
    throw new BadRequestError(ERROR_MESSAGES.RECIPE_IMAGE_REQUIRED);
  }

  await Promise.all([
    ensureCategoryExists(data.categoryId),
    ensureAreaExists(data.areaId),
    ensureIngredientsExist(data.ingredients),
  ]);

  const mainImage = await uploadFile(image, CLOUDINARY_RECIPES_FOLDER);

  return recipeRepository.create({
    id: randomUUID(),
    ownerId: userId,
    ...data,
    mainImage,
  });
};

export const updateRecipe = async (
  recipeId: string,
  data: UpdateRecipeBody,
  image?: Express.Multer.File,
) => {
  const recipe = await recipeRepository.findEntityById(recipeId);

  if (!recipe) {
    throw new NotFoundError(ERROR_MESSAGES.RECIPE_NOT_FOUND);
  }

  if (data.categoryId) {
    await ensureCategoryExists(data.categoryId);
  }

  if (data.areaId) {
    await ensureAreaExists(data.areaId);
  }

  if (data.ingredients) {
    await ensureIngredientsExist(data.ingredients);
  }

  const updateData: UpdateRecipeBody & { mainImage?: string | null } = {
    ...data,
  };

  if (image) {
    updateData.mainImage = await uploadFile(image, CLOUDINARY_RECIPES_FOLDER);

    if (recipe.mainImage) {
      await deleteFile(recipe.mainImage);
    }
  }

  return recipeRepository.update(recipeId, updateData);
};

export const deleteRecipe = async (recipeId: string): Promise<RecipeDeletedResponse> => {
  const deletedRecipe = await recipeRepository.remove(recipeId);

  if (!deletedRecipe) {
    throw new NotFoundError(ERROR_MESSAGES.RECIPE_NOT_FOUND);
  }

  if (deletedRecipe.mainImage) {
    await deleteFile(deletedRecipe.mainImage);
  }

  return {
    id: deletedRecipe.id,
    title: deletedRecipe.title,
  };
};
