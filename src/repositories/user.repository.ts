import prisma from "../lib/prisma";
import { Prisma } from "../generated/prisma/client";

const RECIPE_PREVIEW_LIMIT = 4;

const userSelect = {
  id: true,
  name: true,
  avatar: true,
  email: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const userCardSelect = (currentUserId: string) =>
  ({
    id: true,
    name: true,
    avatar: true,
    email: true,
    recipes: {
      select: { id: true, title: true, mainImage: true },
      orderBy: { createdAt: "desc" as const },
      take: RECIPE_PREVIEW_LIMIT,
    },
    // narrowed to the current user, so isFollowing costs no extra query
    followers: {
      where: { id: currentUserId },
      select: { id: true },
    },
    _count: {
      select: {
        recipes: true,
        favorites: true,
        followers: true,
        following: true,
      },
    },
  }) satisfies Prisma.UserSelect;

export type UserCardRow = Prisma.UserGetPayload<{
  select: ReturnType<typeof userCardSelect>;
}>;

export function findCardById(id: string, currentUserId: string) {
  return prisma.user.findUnique({
    where: { id },
    select: userCardSelect(currentUserId),
  });
}

const userProfileSelect = {
  id: true,
  name: true,
  avatar: true,
  email: true,
  _count: {
    select: {
      recipes: true,
      favorites: true,
      followers: true,
      following: true,
    },
  },
} as const;

const userListSelect = {
  id: true,
  name: true,
  avatar: true,
  email: true,
} as const;

export function findById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });
}

export function findProfileById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: userProfileSelect,
  });
}

export function findByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export function create(data: {
  name: string;
  email: string;
  passwordHash: string;
}) {
  return prisma.user.create({
    data,
  });
}

export function updateAvatar(id: string, avatar: string | null) {
  return prisma.user.update({
    where: { id },
    data: { avatar },
    select: userSelect,
  });
}

export function updatePasswordHash(id: string, passwordHash: string) {
  return prisma.user.update({
    where: { id },
    data: { passwordHash },
    select: { id: true },
  });
}

export function findFollowers(userId: string) {
  return prisma.user
    .findUnique({
      where: { id: userId },
    })
    .followers({
      select: userListSelect,
      orderBy: { name: "asc" },
    });
}

export function findFollowing(userId: string) {
  return prisma.user
    .findUnique({
      where: { id: userId },
    })
    .following({
      select: userListSelect,
      orderBy: { name: "asc" },
    });
}

export async function isFollowing(userId: string, targetUserId: string) {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      following: {
        some: { id: targetUserId },
      },
    },
    select: { id: true },
  });

  return Boolean(user);
}

export function followUser(userId: string, targetUserId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      following: {
        connect: { id: targetUserId },
      },
    },
    select: { id: true },
  });
}

export function unfollowUser(userId: string, targetUserId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      following: {
        disconnect: { id: targetUserId },
      },
    },
    select: { id: true },
  });
}
