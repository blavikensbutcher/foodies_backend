import * as userRepository from "../repositories/user.repository";
import { BadRequestError, NotFoundError } from "../errors/AppError";
import { ERROR_MESSAGES } from "../errors/error.constants";
import { deleteFile, uploadAvatarFile } from "./upload.service";

function toCurrentUserProfile(
  user: NonNullable<Awaited<ReturnType<typeof userRepository.findProfileById>>>,
) {
  return {
    id: user.id,
    avatar: user.avatar,
    name: user.name,
    email: user.email,
    recipesCreatedCount: user._count.recipes,
    favoriteRecipesCount: user._count.favorites,
    subscribersCount: user._count.followers,
    subscriptionsCount: user._count.following,
  };
}

function toPublicUserProfile(
  user: NonNullable<Awaited<ReturnType<typeof userRepository.findProfileById>>>,
) {
  return {
    id: user.id,
    avatar: user.avatar,
    name: user.name,
    email: user.email,
    recipesCreatedCount: user._count.recipes,
    subscribersCount: user._count.followers,
  };
}

export async function getUserById(id: string) {
  const user = await userRepository.findById(id);

  if (!user) {
    throw new NotFoundError(`${ERROR_MESSAGES.USER_NOT_FOUND} (id: "${id}")`);
  }

  return user;
}

export async function getCurrentUserProfile(id: string) {
  const user = await userRepository.findProfileById(id);

  if (!user) {
    throw new NotFoundError(`${ERROR_MESSAGES.USER_NOT_FOUND} (id: "${id}")`);
  }

  return toCurrentUserProfile(user);
}

export async function getUserProfileById(id: string) {
  const user = await userRepository.findProfileById(id);

  if (!user) {
    throw new NotFoundError(`${ERROR_MESSAGES.USER_NOT_FOUND} (id: "${id}")`);
  }

  return toPublicUserProfile(user);
}

export async function updateCurrentUserAvatar(
  id: string,
  avatar: string | null | undefined,
  avatarFile?: Express.Multer.File,
) {
  const currentUser = await userRepository.findById(id);

  if (!currentUser) {
    throw new NotFoundError(`${ERROR_MESSAGES.USER_NOT_FOUND} (id: "${id}")`);
  }

  const nextAvatar = avatarFile ? await uploadAvatarFile(avatarFile) : avatar;

  if (nextAvatar === undefined) {
    throw new BadRequestError("Avatar file or avatar URL is required");
  }

  try {
    const user = await userRepository.updateAvatar(id, nextAvatar);

    if (currentUser.avatar && currentUser.avatar !== nextAvatar) {
      await deleteFile(currentUser.avatar);
    }

    return {
      id: user.id,
      avatar: user.avatar,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    if (avatarFile && nextAvatar) {
      await deleteFile(nextAvatar);
    }

    throw error;
  }
}

export async function getCurrentUserFollowers(id: string) {
  await getCurrentUserProfile(id);

  return userRepository.findFollowers(id);
}

export async function getCurrentUserFollowing(id: string) {
  await getCurrentUserProfile(id);

  return userRepository.findFollowing(id);
}

export async function subscribeToUser(userId: string, targetUserId: string) {
  if (userId === targetUserId) {
    throw new BadRequestError("You cannot subscribe to yourself");
  }

  await getCurrentUserProfile(userId);
  await getUserProfileById(targetUserId);

  const alreadyFollowing = await userRepository.isFollowing(
    userId,
    targetUserId,
  );

  if (alreadyFollowing) {
    return;
  }

  await userRepository.followUser(userId, targetUserId);
}

export async function unsubscribeFromUser(userId: string, targetUserId: string) {
  if (userId === targetUserId) {
    throw new BadRequestError("You cannot unsubscribe from yourself");
  }

  await getCurrentUserProfile(userId);
  await getUserProfileById(targetUserId);
  await userRepository.unfollowUser(userId, targetUserId);
}
