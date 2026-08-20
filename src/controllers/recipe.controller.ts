import { Request, Response } from "express";
import * as recipeService from "../services/recipe.service";

export async function getRecipes(req: Request, res: Response) {
  const { category, ingredient, area, page, limit } = req.query;

  const result = await recipeService.getRecipes({
    category: typeof category === "string" ? category : undefined,
    ingredient: typeof ingredient === "string" ? ingredient : undefined,
    area: typeof area === "string" ? area : undefined,
    page: page ? Number(page) : undefined,
    limit: limit ? Number(limit) : undefined,
  });

  res.json(result);
}

export async function getRecipeById(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;
  const recipe = await recipeService.getRecipeById(id);
  res.json(recipe);
}

export async function getPopularRecipes(_req: Request, res: Response) {
  const recipes = await recipeService.getPopularRecipes();
  res.json(recipes);
}
