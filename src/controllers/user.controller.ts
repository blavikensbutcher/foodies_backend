import { Request, Response } from "express";

import * as userService from "../services/user.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { updateAvatarSchema } from "../utils/user.validation";

function getRouteParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

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

  const user = await userService.getCurrentUserProfile(req.auth.userId);

  res.json(user);
}

export async function getUserProfileById(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;

  const user = await userService.getUserProfileById(id);

  res.json(user);
}

export async function updateCurrentUserAvatar(
  req: AuthenticatedRequest,
  res: Response,
) {
  if (!req.auth) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const data = req.file ? undefined : updateAvatarSchema.parse(req.body);
  const user = await userService.updateCurrentUserAvatar(
    req.auth.userId,
    data?.avatar,
    req.file,
  );

  res.json(user);
}

export async function getCurrentUserFollowers(
  req: AuthenticatedRequest,
  res: Response,
) {
  if (!req.auth) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const followers = await userService.getCurrentUserFollowers(req.auth.userId);

  res.json(followers);
}

export async function getCurrentUserFollowing(
  req: AuthenticatedRequest,
  res: Response,
) {
  if (!req.auth) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const following = await userService.getCurrentUserFollowing(req.auth.userId);

  res.json(following);
}

export async function subscribeToUser(
  req: AuthenticatedRequest,
  res: Response,
) {
  if (!req.auth) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const id = getRouteParam(req.params.id);
  if (!id) {
    res.status(400).json({ message: "User id is required" });
    return;
  }

  await userService.subscribeToUser(req.auth.userId, id);

  res.status(204).send();
}

export async function unsubscribeFromUser(
  req: AuthenticatedRequest,
  res: Response,
) {
  if (!req.auth) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const id = getRouteParam(req.params.id);
  if (!id) {
    res.status(400).json({ message: "User id is required" });
    return;
  }

  await userService.unsubscribeFromUser(req.auth.userId, id);

  res.status(204).send();
}
