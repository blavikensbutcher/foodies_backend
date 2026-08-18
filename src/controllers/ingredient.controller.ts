import { Response } from "express";
import * as ingredientService from "../services/ingredient.service";

export async function getAll(_req: unknown, res: Response) {
  const ingredients = await ingredientService.getAll();
  res.json(ingredients);
}
