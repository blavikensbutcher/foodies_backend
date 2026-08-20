import { Request, Response } from "express";

import * as userService from "../services/user.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";

export async function getUserById(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;

  const user = await userService.getUserById(id);

  res.json(user);
}

export async function getCurrentUser(
  req: AuthenticatedRequest,
  res: Response,
) {
  if (!req.auth) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const user = await userService.getUserById(req.auth.userId);

  res.json(user);
}