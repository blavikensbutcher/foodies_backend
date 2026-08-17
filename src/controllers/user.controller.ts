import { Request, Response } from "express";
import * as userService from "../services/user.service";

export async function getUserById(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;
  const user = await userService.getUserById(id);
  res.json(user);
}
