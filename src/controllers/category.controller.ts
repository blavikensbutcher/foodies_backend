import { Response } from "express";
import * as categoryService from "../services/category.service";

export async function getAll(_req: unknown, res: Response) {
  const categories = await categoryService.getAll();
  res.json(categories);
}
