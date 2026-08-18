import { Response } from "express";
import * as areaService from "../services/area.service";

export async function getAll(_req: unknown, res: Response) {
  const areas = await areaService.getAll();
  res.json(areas);
}
