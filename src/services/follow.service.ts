import * as followRepository from "../repositories/follow.repository";
import { getUserById, getUserProfile, toUserCard } from "./user.service";
import { BadRequestError, ConflictError } from "../errors/AppError";
import { ERROR_MESSAGES } from "../errors/error.constants";
import { buildPageMeta, Pagination, toPrismaPagination } from "../utils/pagination";
import { UserCard, UserListPage } from "../types/user.types";

async function getUserPage(
  findUsers: typeof followRepository.findFollowers,
  userId: string,
  currentUserId: string,
  pagination: Pagination,
): Promise<UserListPage> {
  await getUserById(userId);

  const { items, total } = await findUsers(userId, currentUserId, toPrismaPagination(pagination));

  return {
    users: items.map(toUserCard),
    ...buildPageMeta(total, pagination),
  };
}

async function ensureFollowTarget(currentUserId: string, targetId: string) {
  if (currentUserId === targetId) {
    throw new BadRequestError(ERROR_MESSAGES.CANNOT_FOLLOW_SELF);
  }

  await getUserById(targetId);
}

export function getFollowers(userId: string, currentUserId: string, pagination: Pagination) {
  return getUserPage(followRepository.findFollowers, userId, currentUserId, pagination);
}

export function getFollowing(userId: string, currentUserId: string, pagination: Pagination) {
  return getUserPage(followRepository.findFollowing, userId, currentUserId, pagination);
}

export async function followUser(currentUserId: string, targetId: string): Promise<UserCard> {
  await ensureFollowTarget(currentUserId, targetId);

  if (await followRepository.isFollowing(currentUserId, targetId)) {
    throw new ConflictError(ERROR_MESSAGES.ALREADY_FOLLOWING);
  }

  await followRepository.follow(currentUserId, targetId);

  return getUserProfile(targetId, currentUserId);
}

export async function unfollowUser(currentUserId: string, targetId: string): Promise<UserCard> {
  await ensureFollowTarget(currentUserId, targetId);

  if (!(await followRepository.isFollowing(currentUserId, targetId))) {
    throw new ConflictError(ERROR_MESSAGES.NOT_FOLLOWING);
  }

  await followRepository.unfollow(currentUserId, targetId);

  return getUserProfile(targetId, currentUserId);
}
