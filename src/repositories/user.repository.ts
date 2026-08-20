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
      select: { recipes: true, followers: true, following: true },
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

export function findById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: userSelect,
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