import { Response } from "express";

import * as userService from "../services/user.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { getAuthUserId } from "../utils/auth.context";
import { UserCard } from "../types/user.types";

export async function getUserById(
  req: AuthenticatedRequest<{ id: string }>,
  res: Response<UserCard>,
) {
  const currentUserId = getAuthUserId(req);

  const user = await userService.getUserProfile(req.params.id, currentUserId);

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