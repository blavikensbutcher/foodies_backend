import { Response } from "express";

import * as followService from "../services/follow.service";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { getAuthUserId } from "../utils/auth.context";
import { paginationSchema } from "../utils/pagination";
import { UserCard, UserListPage } from "../types/user.types";

type FollowRequest = AuthenticatedRequest<{ id: string }>;

export async function getFollowers(req: FollowRequest, res: Response<UserListPage>) {
  const currentUserId = getAuthUserId(req);
  const pagination = paginationSchema.parse(req.query);

  const result = await followService.getFollowers(req.params.id, currentUserId, pagination);

  res.json(result);
}

export async function getFollowing(req: FollowRequest, res: Response<UserListPage>) {
  const currentUserId = getAuthUserId(req);
  const pagination = paginationSchema.parse(req.query);

  const result = await followService.getFollowing(req.params.id, currentUserId, pagination);

  res.json(result);
}

export async function follow(req: FollowRequest, res: Response<UserCard>) {
  const currentUserId = getAuthUserId(req);

  const user = await followService.followUser(currentUserId, req.params.id);

  res.status(201).json(user);
}

export async function unfollow(req: FollowRequest, res: Response<UserCard>) {
  const currentUserId = getAuthUserId(req);

  const user = await followService.unfollowUser(currentUserId, req.params.id);

  res.json(user);
}
