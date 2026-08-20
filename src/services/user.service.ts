import * as userRepository from "../repositories/user.repository";
import { NotFoundError } from "../errors/AppError";
import { ERROR_MESSAGES } from "../errors/error.constants";
import { UserCard } from "../types/user.types";

function userNotFound(id: string) {
  return new NotFoundError(`${ERROR_MESSAGES.USER_NOT_FOUND} (id: "${id}")`);
}

export async function getUserById(id: string) {
  const user = await userRepository.findById(id);

  if (!user) {
    throw userNotFound(id);
  }

  return user;
}

export function toUserCard(user: userRepository.UserCardRow): UserCard {
  return {
    id: user.id,
    name: user.name,
    avatar: user.avatar,
    email: user.email,
    recipesCount: user._count.recipes,
    followersCount: user._count.followers,
    followingCount: user._count.following,
    isFollowing: user.followers.length > 0,
    recipes: user.recipes,
  };
}

export async function getUserProfile(
  id: string,
  currentUserId: string,
): Promise<UserCard> {
  const user = await userRepository.findCardById(id, currentUserId);

  if (!user) {
    throw userNotFound(id);
  }

  return toUserCard(user);
}
